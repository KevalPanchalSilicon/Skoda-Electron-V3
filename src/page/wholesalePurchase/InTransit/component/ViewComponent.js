import React, { useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Table } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import { CurrencyFormat, stock_tracking } from "../../../../utils/GlobalFunction";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { InTransitStore, AUTH } = useStore();
	const dateFormat = "DD/MM/YYYY";


	useEffect(() => {
		if (InTransitStore.viewValues && props.visible) {
			form.setFieldsValue({
				supplier_id: InTransitStore.viewValues.supplier.name,
				invoice_no: InTransitStore.viewValues.invoice_no,
				invoice_date: InTransitStore.viewValues.invoice_date ? moment(InTransitStore.viewValues.invoice_date).format("DD/MM/YYYY") : "N/A",
				vrn: InTransitStore.viewValues.vrn,
				location_id: InTransitStore.viewValues.location.name,
				premises_id: InTransitStore.viewValues.premises.name,
				brand_id: InTransitStore.viewValues.brand.name,
				model_id: InTransitStore.viewValues.model.name,
				variant_id: InTransitStore.viewValues.variant.name,
				color_id: InTransitStore.viewValues.color.name,
				// vin: InTransitStore.viewValues.vin,
				chassis_no: InTransitStore.viewValues.chassis_no,
				engine_no: InTransitStore.viewValues.engine_no,
				basic_amount: InTransitStore.viewValues.basic_amount,
				discount: InTransitStore.viewValues.discount,
				tax_amount: InTransitStore.viewValues.tax_amount,
				bill_amount: InTransitStore.viewValues.bill_amount,
				invoice_funding_by: InTransitStore.viewValues.invoice_funding_by,
				purchase_year: InTransitStore.viewValues.purchase_year,
				mfg_year: InTransitStore.viewValues.mfg_year,
				vin_year: InTransitStore.viewValues.vin_year,
				vt_id: InTransitStore.viewValues.vehicle_type.name,
				date_imported: InTransitStore.viewValues.date_imported ? moment(InTransitStore.viewValues.date_imported).format("DD/MM/YYYY") : "N/A",
				date_inward: InTransitStore.viewValues.date_inward ? moment(InTransitStore.viewValues.date_inward).format("DD/MM/YYYY") : "N/A",
				date_booked: InTransitStore.viewValues.date_booked ? moment(InTransitStore.viewValues.date_booked).format("DD/MM/YYYY") : "N/A",
				date_delivered: InTransitStore.viewValues.date_delivered ? moment(InTransitStore.viewValues.date_delivered).format("DD/MM/YYYY") : "N/A",
				is_metalic: InTransitStore.viewValues.is_metalic
			});
		}
	}, [InTransitStore, InTransitStore.viewValues, form, AUTH, props]);

	const tableColumn = [
		{
			title: "Date",
			dataIndex: "created",
			key: "created",
			render: created => <>{created ? moment(created).format("DD/MM/YYYY") : "N/A"}</>,
		},
		{
			title: "Action",
			dataIndex: "action_id",
			key: "action_id",
			render: item => (<>{stock_tracking[item]}</>)
		},
		{
			title: "Note",
			dataIndex: "note",
			key: "note",
		},
	]

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return InTransitStore.viewValues ? (
		<Drawer
			className="addModal"
			title="View Transit"
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Close
				</Button>,
			]}
		>
			<Form
				form={form}
				id="viewTransitForm"
				labelCol={{ span: 24 }}
			>

				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							filterOption="false"
							disabled={true}
							placeholder="Supplier"
							label="Supplier"
							name="supplier_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Invoice Number"
							placeholder="Invoice Number"
							name="invoice_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							// mode="date"
							disabled={true}
							format={dateFormat}
							label="Invoice Date"
							placeholder="Invoice Date"
							name="invoice_date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="VRN"
							placeholder="VRN"
							name="vrn"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							filterOption="false"
							disabled={true}
							placeholder="Location"
							label="Location"
							name="location_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							filterOption="false"
							disabled={true}
							placeholder="Yard"
							label="Yard"
							name="premises_id"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							filterOption="false"
							disabled={true}
							placeholder="Brand"
							label="Brand"
							name="brand_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Model"
							label="Model"
							name="model_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Variant"
							label="Variant"
							name="variant_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Color"
							label="Color"
							name="color_id"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="VIN"
							placeholder="VIN"
							name="vin"
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Chassis Number"
							placeholder="Chassis Number"
							name="chassis_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Engine Number"
							placeholder="Engine Number"
							name="engine_no"
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Basic Amount"
							placeholder="Basic Amount"
							name="basic_amount"
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Basic Amount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: InTransitStore.viewValues.basic_amount, })}
							</div>
						</Form.Item>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Tax Amount"
							placeholder="Tax Amount"
							name="tax_amount"
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Tax Amount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: InTransitStore.viewValues.tax_amount, })}
							</div>
						</Form.Item>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Discount"
							placeholder="Discount"
							name="discount"
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: InTransitStore.viewValues.discount, })}
							</div>
						</Form.Item>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							className="readOnlyField"
							label="Bill Amount"
							placeholder="Bill Amount"
							name="bill_amount"
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Bill Amount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: InTransitStore.viewValues.bill_amount, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Invoice Funding By"
							placeholder="Invoice Funding By"
							name="invoice_funding_by"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Vehicle Type"
							label="Vehicle Type"
							name="vt_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Purchase Year"
							label="Purchase Year"
							name="purchase_year"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Mfg. Year"
							label="Mfg. Year"
							name="mfg_year"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="VIN Year"
							label="VIN Year"
							name="vin_year"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							// mode="date"
							disabled={true}
							format={dateFormat}
							label="Date Import"
							placeholder="Date Import"
							name="date_imported"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							// mode="date"
							disabled={true}
							format={dateFormat}
							label="Date Inward"
							placeholder="Date Inward"
							name="date_inward"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							// mode="date"
							disabled={true}
							format={dateFormat}
							label="Date Booked"
							placeholder="Date Booked"
							name="date_booked"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							// mode="date"
							disabled={true}
							format={dateFormat}
							label="Date Delivered"
							placeholder="Date Delivered"
							name="date_delivered"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="radio_button"
							disabled={true}
							label="Is metalic"
							name="is_metalic"
							options={{
								values: [
									{ value: 1, text: "Yes" },
									{ value: 0, text: "No" },
								],
								value_key: "value",
								text_key: "text",
							}}
						/>
					</Col>
				</Row>
				{InTransitStore.viewValues &&
					<div className="import_table">
						<h3>Stock Tracking</h3>
						<Table
							columns={tableColumn}
							dataSource={InTransitStore.viewValues.stock_tracking}
							pagination="false"
							scroll={{ x: "100%", y: 500 }}
						/>
					</div>}
			</Form>
		</Drawer>
	) : null;
});

export default ViewComponent;
