/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
namespace HuaLiangWindow.Backstage {
    /**
     * 工厂页面
     */
    class FactoryPage {
        /*页面数据*/
        public static PageData = {
            ID: null
        }
        /**
         * 构造方法
         */
        constructor() {
            if (common.IsLogin(true)) {
                this.GetAllEnableFactoryTypeInfo();
                this.BindEvent();
            }
        }
        /**
         * 绑定事件
         */
        private BindEvent() {
            MDMa.AddEvent("BtnSearch", "click", this.BtnSearchEvent_Click);
            MDMa.AddEvent("BtnAdd", "click", FactoryPage.BtnAddEvent_Click);
            MDMa.AddEvent("BtnSave", "click", this.BtnSaveEvent_Click);
            MDMa.AddEvent("BtnDelete", "click", this.BtnDeleteEvent_Click);
            MDMa.AddEvent("BtnUserSearch", "click", this.BtnUserSearchEvent_Click);
            MDMa.AddEvent("InputName", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                common.InputInvalidEvent_Invalid(e, setting);
            });
            MDMa.AddEvent("InputRemark", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                common.InputInvalidEvent_Invalid(e, setting);
            });
            MDMa.AddEvent("SearchSearchTxt", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Required = "不能为空";
                common.InputInvalidEvent_Invalid(e, setting);
            });
        }
        /**
         * 获得所有启用的工厂类型信息
         */
        private GetAllEnableFactoryTypeInfo() {
            let url: string = "api/FactoryType/GetAllEnableFactoryTypeInfo";
            let data = FactorySearchModel.GetInputData();
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                let InputFactoryType = MDMa.$("InputFactoryType") as HTMLSelectElement;
                InputFactoryType.innerHTML = "";
                let listM = resM["Data"] as Array<any>;
                for (var i = 0; i < listM.length; i++) {
                    let option = new Option(listM[i]["Name"], listM[i]["ID"]);
                    InputFactoryType.options.add(option);
                }
                FactoryPage.GetList();
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"])
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
            };
            common.SendGetAjax(url, data, SFun, FFun, CFun);
        }
        /**
         * 获得列表
         */
        private static GetList() {
            let url: string = "api/Factory/GetFactoryInfoByWhere";
            let data = FactorySearchModel.GetInputData();
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                FactoryPage.BindListInfo(resM["Data"]);
                common.BindPageInfo(resM["PagingInfo"] as MPagingModel, FactoryPage.GetList);
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"])
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
            };
            common.SendGetAjax(url, data, SFun, FFun, CFun);
        }
        /**
         * 绑定列表信息
         * @param listM 
         */
        private static BindListInfo(listM: Array<any>): void {
            let DataTable = MDMa.$("DataTable") as HTMLTableSectionElement;
            DataTable.innerHTML = "";
            if (!MTMa.IsNullOrUndefined(listM)) {
                for (let i = 0; i < listM.length; i++) {
                    let Item = document.createElement("tr");
                    let Index = document.createElement("td");
                    Index.textContent = (common.PagingM.PageModel.PagingSize * (common.PagingM.PageModel.PagingIndex - 1) + i + 1).toString();
                    Item.appendChild(Index);
                    let Name = document.createElement("td");
                    Name.textContent = listM[i]["Name"];
                    Item.appendChild(Name);
                    let Remark = document.createElement("td");
                    Remark.textContent = listM[i]["Remark"];
                    Item.appendChild(Remark);
                    let IfEnable = document.createElement("td");
                    IfEnable.textContent = listM[i]["IfEnable"] ? "启用" : "禁用";
                    Item.appendChild(IfEnable);
                    let Operation = document.createElement("td");
                    let OperationBtnGroup = document.createElement("div");
                    MDMa.AddClass(OperationBtnGroup, "btn-group");
                    let SetUserBtn = document.createElement("button");
                    MDMa.AddClass(SetUserBtn, "btn btn-primary");
                    SetUserBtn.setAttribute("type", "button");
                    SetUserBtn.textContent = "设置用户";
                    MDMa.AddEvent(SetUserBtn, "click", FactoryPage.BtnSetUserEvent_Click);
                    SetUserBtn.dataset.id = listM[i]["ID"];
                    OperationBtnGroup.appendChild(SetUserBtn);
                    let EditBtn = document.createElement("button");
                    MDMa.AddClass(EditBtn, "btn btn-default");
                    EditBtn.setAttribute("type", "button");
                    EditBtn.textContent = "编辑";
                    MDMa.AddEvent(EditBtn, "click", FactoryPage.BtnEditEvent_Click);
                    EditBtn.dataset.id = listM[i]["ID"];
                    OperationBtnGroup.appendChild(EditBtn);
                    let RemoveBtn = document.createElement("button");
                    MDMa.AddClass(RemoveBtn, "btn btn-danger");
                    RemoveBtn.setAttribute("type", "button");
                    RemoveBtn.textContent = "删除";
                    RemoveBtn.dataset.toggle = "modal";
                    RemoveBtn.dataset.target = "#DeleteModal";
                    MDMa.AddEvent(RemoveBtn, "click", FactoryPage.BtnRemoveEvent_Click);
                    RemoveBtn.dataset.id = listM[i]["ID"];
                    OperationBtnGroup.appendChild(RemoveBtn);
                    Operation.appendChild(OperationBtnGroup);
                    Item.appendChild(Operation);
                    DataTable.appendChild(Item);
                }
            }
        }
        /**
         * 查询按钮
         * @param e
         */
        private BtnSearchEvent_Click(e: MouseEvent) {
            common.PagingM.PageModel.PagingIndex = 1;
            common.PagingM.PageModel.PagingCount = 99;
            FactoryPage.GetList();
        }
        /**
         * 新增按钮单击事件
         */
        private static BtnAddEvent_Click(e: MouseEvent) {
            let btnElement = e.target as HTMLButtonElement;
            common.ClearModalForm("EditModal");
            let EditModalLabel = MDMa.$("EditModalLabel") as HTMLHeadingElement;
            EditModalLabel.textContent = "新增";
            FactoryPage.PageData.ID = null;
        }
        /**
         * 编辑按钮单击事件
         */
        private static BtnEditEvent_Click(e: MouseEvent) {
            let btnElement = e.target as HTMLButtonElement;
            common.ClearModalForm("EditModal");
            let EditModalLabel = MDMa.$("EditModalLabel") as HTMLHeadingElement;
            EditModalLabel.textContent = "新增";
            FactoryPage.PageData.ID = btnElement.dataset.id;
            FactoryPage.GetFactoryInfoByID();
        }
        /**
         * 移除按钮单击事件
         */
        private static BtnRemoveEvent_Click(e: MouseEvent) {
            let btnElement = e.target as HTMLButtonElement;
            FactoryPage.PageData.ID = btnElement.dataset.id;
        }
        /**
         * 根据ID获得工厂信息
         * @param ID
         */
        private static GetFactoryInfoByID() {
            let url = "api/Factory/GetFactoryInfoByID";
            let data = {
                ID: FactoryPage.PageData.ID
            };
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                let perM = resM["Data"];
                common.BindInputInfo(perM);
                $('#EditModal').modal('toggle');
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"]);
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
            };
            common.SendGetAjax(url, data, SFun, FFun, CFun);
        }
        /**
         * 保存按钮单击事件
         * @param e
         */
        private BtnSaveEvent_Click(e: MouseEvent) {
            common.ClearErrorMessage();
            let data = FactoryInputModel.GetInputData();
            if (data != null) {
                let BtnElement = e.target as HTMLButtonElement;
                BtnElement.textContent = "保存中......";
                BtnElement.disabled = true;
                let url: string;
                if (MTMa.IsNullOrUndefinedOrEmpty(FactoryPage.PageData.ID)) {
                    url = "api/Factory/AddFactory";
                }
                else {
                    url = "api/Factory/EditFactory";
                }
                let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    FactoryPage.GetList();
                    $('#EditModal').modal('toggle');
                };
                let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    common.ShowMessageBox(resM["Message"]);
                };
                let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    BtnElement.textContent = "保存";
                    BtnElement.disabled = false;
                };
                common.SendPostAjax(url, data, SFun, FFun, CFun);
            }
        }
        /**
         * 删除按钮单击事件
         * @param e
         */
        private BtnDeleteEvent_Click(e: MouseEvent) {
            let BtnElement = e.target as HTMLButtonElement;
            BtnElement.textContent = "删除中......";
            BtnElement.disabled = true;
            let url = "api/Factory/DeleteFactory";
            let data = {
                ID: FactoryPage.PageData.ID
            };
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                $('#DeleteModal').modal('toggle');
                FactoryPage.GetList();
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"]);
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                BtnElement.textContent = "删除";
                BtnElement.disabled = false;
            };
            common.SendPostAjax(url, data, SFun, FFun, CFun);
        }
        /**
         * 设置用户信息按钮单击事件
         * @param e
         */
        private static BtnSetUserEvent_Click(e: MouseEvent) {
            let BtnElement = e.target as HTMLButtonElement;
            FactoryPage.PageData.ID = BtnElement.dataset.id;
            BtnElement.disabled = true;
            let url = "api/Factory/GetUsrViewInfoByFactoryID";
            let data = {
                ID: FactoryPage.PageData.ID
            };
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                let UserList = MDMa.$("UserList");
                UserList.innerHTML = "";
                for (var i = 0; i < resM["Data"]["length"]; i++) {
                    let li = FactoryPage.GetUserItem(resM["Data"][i]);
                    UserList.appendChild(li);
                }
                $('#UserModal').modal('toggle');
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"]);
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                BtnElement.disabled = false;
            };
            common.SendGetAjax(url, data, SFun, FFun, CFun);
        }
        /**
         * 获得用户单项Element
         * @param item
         */
        private static GetUserItem(item): HTMLLIElement {
            let li = document.createElement("li");
            let text = document.createTextNode(item["TrueName"] + "(" + item["Mobile"] + ")");
            let button = document.createElement("button");
            MDMa.AddClass(button, "btn btn-danger btn-xs");
            button.textContent = "移除";
            button.dataset.id = item["ID"];
            MDMa.AddEvent(button, "click", FactoryPage.RemoveUserBtnEvent);
            li.appendChild(text);
            li.appendChild(button);
            return li;
        }
        /**
         * 查询用户按钮
         * @param e
         */
        private BtnUserSearchEvent_Click(e: MouseEvent) {
            common.ClearErrorMessage();
            let SearchUserForm = document.forms["SearchUserForm"] as HTMLFormElement;
            if (!MTMa.IsNullOrUndefined(SearchUserForm) && SearchUserForm.checkValidity()) {
                let BtnElement = e.target as HTMLButtonElement;
                BtnElement.disabled = true;
                let url = "api/User/GetUserInfoBySearchTxt";
                let data = {
                    SearchTxt: MDMa.GetInputValue("SearchSearchTxt")
                };
                let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    let UserDataTable = MDMa.$("UserDataTable") as HTMLTableSectionElement;
                    UserDataTable.innerHTML = "";
                    let listM = resM["Data"] as Array<Object>;
                    for (let i = 0; i < listM.length; i++) {
                        let Item = document.createElement("tr");
                        let NickName = document.createElement("td");
                        NickName.textContent = listM[i]["NickName"];
                        Item.appendChild(NickName);
                        let TrueName = document.createElement("td");
                        TrueName.textContent = listM[i]["TrueName"];
                        Item.appendChild(TrueName);
                        let Mobile = document.createElement("td");
                        Mobile.textContent = listM[i]["Mobile"];
                        Item.appendChild(Mobile);
                        let Operation = document.createElement("td");
                        let OperationBtnGroup = document.createElement("div");
                        MDMa.AddClass(OperationBtnGroup, "btn-group");
                        let SetUserBtn = document.createElement("button");
                        MDMa.AddClass(SetUserBtn, "btn btn-primary btn-xs");
                        SetUserBtn.setAttribute("type", "button");
                        SetUserBtn.textContent = "添加";
                        MDMa.AddEvent(SetUserBtn, "click", FactoryPage.AddUserBtnEvent);
                        SetUserBtn.dataset.id = listM[i]["ID"];
                        SetUserBtn.dataset.name = listM[i]["TrueName"];
                        SetUserBtn.dataset.mobile = listM[i]["Mobile"];
                        OperationBtnGroup.appendChild(SetUserBtn);
                        Operation.appendChild(OperationBtnGroup);
                        Item.appendChild(Operation);
                        UserDataTable.appendChild(Item);
                    }
                };
                let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    common.ShowMessageBox(resM["Message"]);
                };
                let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    BtnElement.disabled = false;
                };
                common.SendGetAjax(url, data, SFun, FFun, CFun);
            }
        }
        /**
         * 移除用户按钮事件
         * @param e 触发对象
         */
        public static RemoveUserBtnEvent(e: MouseEvent) {
            let BtnElement = e.target as HTMLButtonElement;
            BtnElement.textContent = "移除中......";
            BtnElement.disabled = true;
            let UserID = BtnElement.dataset["id"];
            let url: string = "api/Factory/RemoveUser";
            let data = {
                FactoryID: FactoryPage.PageData.ID,
                UserID: UserID
            };
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                BtnElement.parentElement.parentElement.removeChild(BtnElement.parentElement);
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"]);
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                BtnElement.textContent = "移除";
                BtnElement.disabled = false;
            };
            common.SendPostAjax(url, data, SFun, FFun, CFun);
        }
        /**
         * 添加用户按钮事件
         * @param e 触发对象
         */
        public static AddUserBtnEvent(e: MouseEvent) {
            let BtnElement = e.target as HTMLButtonElement;
            BtnElement.textContent = "添加中......";
            BtnElement.disabled = true;
            let UserID = BtnElement.dataset["id"];
            let TrueName = BtnElement.dataset["name"];
            let Mobile = BtnElement.dataset["mobile"];
            let url: string = "api/Factory/AddUser";
            let data = {
                FactoryID: FactoryPage.PageData.ID,
                UserID: UserID
            };
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                let UserList = MDMa.$("UserList");
                let li = FactoryPage.GetUserItem({
                    ID: UserID,
                    TrueName: TrueName,
                    Mobile: Mobile,
                });
                UserList.appendChild(li);
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"]);
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                BtnElement.textContent = "添加";
                BtnElement.disabled = false;
            };
            common.SendPostAjax(url, data, SFun, FFun, CFun);
        }
    }
    /**
     * 工厂查询模型
     */
    class FactorySearchModel {
        /*名称*/
        public Name: string;
        /*启用标识*/
        public IfEnable: boolean;
        /*当前页数*/
        public PageIndex: number;
        /*每页显示数量*/
        public PageSize: number;
        /**
         * 获得输入模型
         */
        public static GetInputData(): FactorySearchModel {
            let data: FactorySearchModel = {
                Name: MDMa.GetInputValue("SearchName"),
                IfEnable: MDMa.GetInputValue("SearchIfEnable"),
                PageIndex: common.PagingM.PageModel.PagingIndex,
                PageSize: common.PagingM.PageModel.PagingSize,
            };
            return data;
        }
    }
    /**
     * 工厂输入模型
     */
    class FactoryInputModel {
        /*唯一标识*/
        public ID: string;
        /*名称*/
        public Name: string;
        /*所属工厂类型*/
        public FK_FactoryType: string;
        /*启用标识*/
        public IfEnable: boolean;
        /*备注*/
        public Remark: string;
        /**
         * 获得输入模型
         */
        public static GetInputData(): FactoryInputModel {
            let data: FactoryInputModel = null;
            let InputForm = document.forms["InputForm"] as HTMLFormElement;
            if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                data = {
                    ID: FactoryPage.PageData.ID,
                    Name: MDMa.GetInputValue("InputName"),
                    FK_FactoryType: MDMa.GetInputValue("InputFactoryType"),
                    IfEnable: (MDMa.$("InputIfEnable") as HTMLInputElement).checked,
                    Remark: MDMa.GetInputValue("InputRemark"),
                };
            }
            return data;
        }
    }
    /*页面加载完成时触发*/
    MDMa.AddEvent(window, "load", function () {
        let pageM = new FactoryPage();
    });
}