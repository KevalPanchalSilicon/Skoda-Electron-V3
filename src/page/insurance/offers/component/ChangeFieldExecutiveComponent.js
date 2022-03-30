import React, { useEffect, useState } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../../component/InputComponent';
import { vsmNotify, vsmChangeTelecaller } from "../../../../config/messages";
import moment from 'moment';
import { default_roles, insurance_type } from '../../../../utils/GlobalFunction';

const ChangeFieldExecutiveComponent = observer((props) => {

	const [form] = Form.useForm()
	const {
		InsuranceOfferStore
	} = useStore();

	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	const handleSubmit = (data) => {
		setSaving(true);
		data.id = InsuranceOfferStore.insurance_detail.id
		InsuranceOfferStore.ChangeFieldExecutive(data)
			.then((data) => {
				if (InsuranceOfferStore.viewValues) {
					InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
				}
				close();
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			})
			.finally(() => setSaving(false));
	};

	// check for valid form values then accordingly make save button disable/enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	}, 500);

	useEffect(() => {
		if (InsuranceOfferStore.insurance_detail && props.visible) {
			form.setFieldsValue({
				fe_id: InsuranceOfferStore.insurance_detail.fe_id ? InsuranceOfferStore.insurance_detail.field_executive.name : "N/A"
			});
		}
	}, [props, InsuranceOfferStore.insurance_detail, form])

	const getFieldExecutiveChange = () => {
		let formData = {
			role_id: [default_roles.field_executive],
			location_id: InsuranceOfferStore.insurance_detail.location_id
		}
		InsuranceOfferStore.getFieldExecutiveList(formData)
	}

	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	}

	return (
		<Modal
			centered
			title={`Change Field Executive (${InsuranceOfferStore.insurance_detail?.code})`}
			visible={props.visible}
			width="720px"
			onCancel={close}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
			footer={[
				<Button
					key="3"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Cancel
				</Button>,
				<Button
					key="1"
					form="changeFieldExecutiveForm"
					loading={saving}
					disabled={disabled}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,

			]}
		>
			<Form form={form}
				id="changeFieldExecutiveForm"
				layout="vertical"
				onFinish={handleSubmit}
				onChange={handleChange}
			>
				<Row gutter={30} className="zform_block_wrapper">
					{
						InsuranceOfferStore.insurance_detail.booking_id ?
							<Col xs={{ span: 24 }} sm={{ span: 8 }} >
								<div className="zform_block blue_block">
									<p>CO NO</p>
									<span title={InsuranceOfferStore.insurance_detail.booking?.co_no ? InsuranceOfferStore.insurance_detail.booking?.co_no :"N/A"} >
										{InsuranceOfferStore.insurance_detail.booking?.co_no ? InsuranceOfferStore.insurance_detail.booking?.co_no :"N/A"}
									</span>
									<span className="small">{InsuranceOfferStore.insurance_detail?.booking?.date ? moment(InsuranceOfferStore.insurance_detail?.booking?.date).format("DD/MM/YYYY") : "N/A"}</span>
								</div>
							</Col>
							:
							<Col xs={{ span: 24 }} sm={{ span: 8 }} >
								<div className="zform_block blue_block">
									<p>INS. OFFER</p>
									<span title={InsuranceOfferStore.insurance_detail.code}>
										{InsuranceOfferStore.insurance_detail.code}
									</span>
									<span className="small">{insurance_type[InsuranceOfferStore.insurance_detail.type_id]}</span>
								</div>
							</Col>
					}
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block">
							<p>Customer</p>
							<span title={InsuranceOfferStore.insurance_detail.ins_customer?.full_name}>
								{InsuranceOfferStore.insurance_detail.ins_customer?.full_name}
							</span>
							<span className="small">{InsuranceOfferStore.insurance_detail.location?.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block">
							<p>VEHICLE</p>
							<span title={InsuranceOfferStore.insurance_detail.ins_vehicle ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant : "N/A" : "N/A"}>
								{InsuranceOfferStore.insurance_detail.ins_vehicle ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant : "N/A" : "N/A"}
							</span>
							<span className="small">{InsuranceOfferStore.insurance_detail.ins_vehicle ? InsuranceOfferStore.insurance_detail.ins_vehicle.color ? InsuranceOfferStore.insurance_detail.ins_vehicle.color : "N/A" : "N/A"}</span>
						</div>
					</Col>

				</Row>

				<Row align="middle" gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Existing Field Executive"
							placeholder="Existing Field Executive"
							name="fe_id"
							disabled
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="New Field Executive"
							name="user_id"
							placeholder="Select Field Executive"
							rules={vsmChangeTelecaller.validation.user_id}
							onChange={handleChange}
							onFocus={() =>
								getFieldExecutiveChange()
							}
							options={{
								values: InsuranceOfferStore.dropdown_fieldExcutive_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									InsuranceOfferStore.dropdown_fieldExcutive_list &&
									InsuranceOfferStore.dropdown_fieldExcutive_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default ChangeFieldExecutiveComponent
