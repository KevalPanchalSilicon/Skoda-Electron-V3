/*global scanner*/
/*eslint no-undef: "error"*/
import { Button, Form, Typography, Image } from "antd";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import InputComponent from "../component/InputComponent";
import { vsmAuth, vsmNotify } from "../config/messages";
import useStore from "../store";
import Banner_img from "../images/login-bg.png";
import logo from "../images/logo.png";
import Webcam from "react-webcam";
import BarcodeReader from "react-barcode-reader";
// import 'scanner-js/dist/scanner.js';
// import 'scanner-js/dist/scanner.css';

let plateform = localStorage.getItem("PLATFORMOS");
if(plateform === "win32"){
	require('scanner-js/dist/scanner.js');
	require('scanner-js/dist/scanner.css');
}

const Login = observer((props) => {
	const [form] = Form.useForm();
	const history = useHistory()
	const [disabled, setDisabled] = useState(true);
	const [saving, setSaving] = useState();
	const state = props?.location?.state ? props.location.state : {}
	const {
		AUTH: { company, doLogin, remember_me },
	} = useStore();

	const [hasCamera, setHasCamera] = useState(false);
	const [cameraPermission, setCameraPermission] = useState();

	const webcamRef = useRef(null);
	const [imgSrc, setImgSrc] = useState(null);

	const capture = useCallback(
		() => {
		  const imageSrc = webcamRef.current.getScreenshot();
		  setImgSrc(imageSrc);
		},
		[webcamRef, setImgSrc]
	);

	/*
	 * For scan document Start 	 * 
	 */
	const scanDocument = () => {
		console.log("asdasdasd : ", plateform);
		if(plateform === "win32"){
			scanner.scan(displayImagesOnPage, {
			use_asprise_dialog: true, // Whether to use Asprise Scanning Dialog
			show_scanner_ui: true, //
			output_settings: [
				{
				type: "return-base64",
				format: "jpg"
				}
			]
			});
		}
	  };
	  const displayImagesOnPage = (successful, mesg, response) => {
		if (!successful) {
		  // On error
		  console.error("Failed: " + mesg);
		  return;
		}
	
		if (
		  successful &&
		  mesg != null &&
		  mesg.toLowerCase().indexOf("user cancel") >= 0
		) {
		  // User cancelled.
		  console.info("User cancelled");
		  return;
		}
	
		var scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
		console.log("User Image", scannedImages);
		// for(var i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
		//     var scannedImage = scannedImages[i];
		//     processScannedImage(scannedImage);
		// }
	  };
	/**
	 * Scan Document End
	 */
	useEffect(()=>{
		// navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
        //                navigator.webkitGetUserMedia ||
        //                navigator.mozGetUserMedia ||
        //                navigator.msGetUserMedia);

		// navigator.getMedia({video: true}, function() {
		// 	setHasCamera(true);
		// }, function() {
		// 	setHasCamera(false);
		// });
		window.navigator.webkitGetUserMedia({video: true}, () => {
			setHasCamera(true);
		  },()=>{
			setHasCamera(false);
		  });
		let permission = navigator.permissions.query( { name: "camera" } );
		permission.then(data => {
			setCameraPermission(data.state);
		})
	}, [])

	// handle password tool tip visiblility
	const handleChangePassword = (e) => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	};

	// make function call to login
	const handleSubmit = (data) => {
		setSaving(true);
		doLogin(data)
			.then((data) => {
				if (state?.redirectPath) {
					history.push({ pathname: state.redirectPath })
				}
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			}).finally(() => setSaving(false));
	};

	useEffect(() => {
		console.log("object : ","version latest 1.3.13");
		const timer = setInterval(() => {
			console.log("object : ","1.3.13",localStorage.getItem("UUID"));
		}, 1000);
		if (remember_me) {
			form.setFieldsValue({
				email: remember_me.email,
				password: remember_me.password,
			});
		}
		return () => {
			clearInterval(timer);
		}
	}, [remember_me, form]);

	const handleError = (err) => {
		form.setFieldsValue({login_id: err});
		console.log("Error : ", err)
	};

	const handleBarcodeScan = (data) => {
		form.setFieldsValue({login_id: data});
		console.log("data : ", data);
	};

	return (
		
		<div className="login__page__wrapper">
			<BarcodeReader 
					onError={(e)=>{
						handleError(e);
					}}
					onScan={(e)=>{
						handleBarcodeScan(e);
					}}
				/>
			<div className="login__page__title__wrapper">
				<div
					className="login__page_img_wrapper"
					style={{
						backgroundImage: `url(${company ? company.branding.hero_image : Banner_img
							})`,
					}}
				></div>

				<div className="login__page__form">
					<div className="logo_wrapper">
						<img src={company ? company.branding.logo : logo} alt="Logo" />
					</div>
					<Typography.Title level={2} className="w-100 login_title">
						Login 1.3.13
					</Typography.Title>
					{hasCamera && cameraPermission !== "denied" && 
						<>
							<Webcam
								audio={false}
								height={360}
								ref={webcamRef}
								screenshotFormat="image/jpeg"
								width={640}
								
							/>
							<button onClick={capture}>Capture photo</button>
							{imgSrc && (
								<Image
								src={imgSrc}
								/>
							)}
						</>
					}
					<button onClick={scanDocument}>Scan</button>
					<Form form={form} onFinish={handleSubmit} labelCol={{ span: 24 }}>
						<InputComponent
							label="Username or Mobile no"
							type="text"
							hasFeedback
							name="login_id"
							placeholder="Username or Mobile no"
							onChange={handleChangePassword}
							onFocus={handleChangePassword}
							rules={vsmAuth.validation.email}
						/>

						<InputComponent
							hasFeedback
							label="Password"
							type="password"
							name="password"
							placeholder="Password"
							onChange={handleChangePassword}
							onFocus={handleChangePassword}
							rules={vsmAuth.validation.password}
						/>
						<div className="remember_forgot_wrap">
							<Link
								to="/forgot-password"
								type="link"
								className="forgot_pass_link"
							>
								Forgot password?
							</Link>
						</div>
						<Button
							disabled={disabled}
							htmlType="submit"
							block
							type="primary"
							size="large"
							loading={saving}
						>
							sign in
						</Button>
					</Form>
				</div>
			</div>
			<div className="login__page__form__section"></div>
		</div>
	);
});

export default Login;
