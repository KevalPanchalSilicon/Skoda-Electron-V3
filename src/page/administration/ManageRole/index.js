import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./component/ListComponent";
import ScopeComponent from "./component/ScopeComponent";
import AddComponent from "./component/AddComponent";
import EditComponent from "./component/EditComponent";
import { vsmNotify } from "../../../config/messages";
import WidgetComponent from "./component/WidgetComponent";
import DeleteComponent from "./component/DeleteComponent";

const ManageRole = observer((props) => {
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [scopeModal, setScopeModal] = useState(false);
	const [widgetModal, setWidgetModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const {
		AUTH,
		ManageRoleStore: {
			getList,
			setEditValues,
			setScopeValues,
			setDeleteValues,
			setWidgetValues,
			TogglepublishData,
			setPageSize,
			per_page,
			agGrid,
		},
	} = useStore();

	// Open & Close  form for add new State
	const openAddModal = () => setAddModal(true);
	const closeAddModal = () => setAddModal(false);

	// Open & Close  form for edit State
	const openEditModal = (data) => {
		setEditValues(data);
		setEditModal(true);
	};
	const closeEditModal = () => setEditModal(false);

	// Open & Close  form for edit State
	const openWidgetModal = (data) => {
		setWidgetValues(data);
		setWidgetModal(true);
	};
	const closeWidgetModal = () => setWidgetModal(false);

	// Open & Close  form for edit State
	const openScopeModal = (data) => {
		setScopeValues(data);
		setScopeModal(true);
	};
	const closeScopeModal = () => setScopeModal(false);

	// Open & Close  form for edit State
	const openDeleteModal = (data) => {
		setDeleteValues(data);
		setDeleteModal(true);
	};
	const closeDeleteModal = () => setDeleteModal(false);

	// Handle on switch data
	const onSwitchChange = (checked, data) => {
		handlePublish(data);
	};

	// Handle Publish and call function to active user
	const handlePublish = (data) => {
		let formdata = data;
		TogglepublishData(formdata)
			.then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch(() => {
				agGrid.api.refreshCells({ force: true });
			});
	};

	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.ManageRole.title}
				className="tableAreaSec"
				extra={<BreadcrumbComponent items={BreadcrumbConfig.ManageRole.path} />}
			>
				<div className="listCountNew">
					{AUTH.checkPrivileges("#1080#") && (
						<Button key="1" onClick={openAddModal}>
							New
						</Button>
					)}
					<RecordPerPage
						key="2"
						style={{ width: "150px" }}
						defaultValue={per_page + " per page"}
						onChange={setPageSize}
					/>
				</div>
				<AddComponent visible={addModal} close={closeAddModal} />
				<EditComponent visible={editModal} close={closeEditModal} />
				<ScopeComponent visible={scopeModal} close={closeScopeModal} />
				<WidgetComponent visible={widgetModal} close={closeWidgetModal} />
				<DeleteComponent visible={deleteModal} close={closeDeleteModal} />
				<ListComponent
					openEditModal={openEditModal}
					openScopeModal={openScopeModal}
					openWidgetModal={openWidgetModal}
					onSwitchChange={onSwitchChange}
					openDeleteModal={openDeleteModal}
				/>
			</PageHeader>
		</>
	);
});

export default ManageRole;
