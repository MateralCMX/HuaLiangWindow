/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
namespace HuaLiangWindow.Backstage {
    /**
     * 用户页面
     */
    class UserPage {
        /*页面数据*/
        public static PageData = {
            ID: null
        }
        /**
         * 构造方法
         */
        constructor() {
            if (common.IsLogin(true)) {
                UserPage.GetList();
                this.BindAllSex();
                this.BindEvent();
            }
        }
        /**
         * 绑定事件
         */
        private BindEvent() {
            MDMa.AddEvent("BtnSearch", "click", this.BtnSearchEvent_Click);
            MDMa.AddEvent("BtnAdd", "click", UserPage.BtnAddEvent_Click);
            MDMa.AddEvent("BtnSave", "click", this.BtnSaveEvent_Click);
            MDMa.AddEvent("BtnDelete", "click", this.BtnDeleteEvent_Click);
            //MDMa.AddEvent("BtnSaveUserGroup", "click", this.BtnSaveUserGroupEvent_Click);
            MDMa.AddEvent("InputTrueName", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                common.InputInvalidEvent_Invalid(e, setting);
            });
            MDMa.AddEvent("InputNickName", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                common.InputInvalidEvent_Invalid(e, setting);
            });
            MDMa.AddEvent("InputUserName", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                common.InputInvalidEvent_Invalid(e, setting);
            });
            MDMa.AddEvent("InputMobile", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                common.InputInvalidEvent_Invalid(e, setting);
            });
            MDMa.AddEvent("InputEmail", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                common.InputInvalidEvent_Invalid(e, setting);
            });
            MDMa.AddEvent("InputWeChatWorkUserID", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                common.InputInvalidEvent_Invalid(e, setting);
            });
        }
        /**
         * 获得列表
         */
        private static GetList() {
            if (common.PagingM.PageModel.PagingIndex <= common.PagingM.PageModel.PagingCount) {
                let url: string = "api/User/GetUserInfoByWhere";
                let data = UserSearchModel.GetInputData();
                let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    UserPage.BindListInfo(resM["Data"]);
                    common.BindPageInfo(resM["PagingInfo"] as MPagingModel, UserPage.GetList);
                };
                let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    common.ShowMessageBox(resM["Message"])
                };
                let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                };
                common.SendGetAjax(url, data, SFun, FFun, CFun);
            }
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
                    let TrueName = document.createElement("td");
                    TrueName.textContent = listM[i]["TrueName"];
                    Item.appendChild(TrueName);
                    let NickName = document.createElement("td");
                    NickName.textContent = listM[i]["NickName"];
                    Item.appendChild(NickName);
                    let Email = document.createElement("td");
                    Email.textContent = listM[i]["Email"];
                    Item.appendChild(Email);
                    let Mobile = document.createElement("td");
                    Mobile.textContent = listM[i]["Mobile"];
                    Item.appendChild(Mobile);
                    let UserName = document.createElement("td");
                    UserName.textContent = listM[i]["UserName"];
                    Item.appendChild(UserName);
                    let IfEnable = document.createElement("td");
                    IfEnable.textContent = listM[i]["IfEnable"] ? "启用" : "禁用";
                    Item.appendChild(IfEnable);
                    let Operation = document.createElement("td");
                    let OperationBtnGroup = document.createElement("div");
                    MDMa.AddClass(OperationBtnGroup, "btn-group");
                    let SetUserGroupBtn = document.createElement("button");
                    MDMa.AddClass(SetUserGroupBtn, "btn btn-primary");
                    SetUserGroupBtn.setAttribute("type", "button");
                    SetUserGroupBtn.textContent = "设置用户组";
                    MDMa.AddEvent(SetUserGroupBtn, "click", UserPage.BtnSetUserGroupEvent_Click);
                    SetUserGroupBtn.dataset.id = listM[i]["ID"];
                    OperationBtnGroup.appendChild(SetUserGroupBtn);
                    let EditBtn = document.createElement("button");
                    MDMa.AddClass(EditBtn, "btn btn-default");
                    EditBtn.setAttribute("type", "button");
                    EditBtn.textContent = "编辑";
                    MDMa.AddEvent(EditBtn, "click", UserPage.BtnEditEvent_Click);
                    EditBtn.dataset.id = listM[i]["ID"];
                    OperationBtnGroup.appendChild(EditBtn);
                    let RemoveBtn = document.createElement("button");
                    MDMa.AddClass(RemoveBtn, "btn btn-danger");
                    RemoveBtn.setAttribute("type", "button");
                    RemoveBtn.textContent = "删除";
                    RemoveBtn.dataset.toggle = "modal";
                    RemoveBtn.dataset.target = "#DeleteModal";
                    MDMa.AddEvent(RemoveBtn, "click", UserPage.BtnRemoveEvent_Click);
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
            UserPage.GetList();
        }
        /**
         * 新增按钮单击事件
         */
        private static BtnAddEvent_Click(e: MouseEvent) {
            let btnElement = e.target as HTMLButtonElement;
            common.ClearModalForm("EditModal");
            let EditModalLabel = MDMa.$("EditModalLabel") as HTMLHeadingElement;
            EditModalLabel.textContent = "新增";
            UserPage.PageData.ID = null;
        }
        /**
         * 编辑按钮单击事件
         */
        private static BtnEditEvent_Click(e: MouseEvent) {
            let btnElement = e.target as HTMLButtonElement;
            common.ClearModalForm("EditModal");
            let EditModalLabel = MDMa.$("EditModalLabel") as HTMLHeadingElement;
            EditModalLabel.textContent = "新增";
            UserPage.PageData.ID = btnElement.dataset.id;
            UserPage.GetUserInfoByID();
        }
        /**
         * 移除按钮单击事件
         */
        private static BtnRemoveEvent_Click(e: MouseEvent) {
            let btnElement = e.target as HTMLButtonElement;
            UserPage.PageData.ID = btnElement.dataset.id;
        }
        /**
         * 根据ID获得用户信息
         * @param ID
         */
        private static GetUserInfoByID() {
            let url = "api/User/GetUserViewInfoByID";
            let data = {
                ID: UserPage.PageData.ID
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
            let data = UserInputModel.GetInputData();
            if (data != null) {
                let BtnElement = e.target as HTMLButtonElement;
                BtnElement.textContent = "保存中......";
                BtnElement.disabled = true;
                let url: string;
                if (MTMa.IsNullOrUndefinedOrEmpty(UserPage.PageData.ID)) {
                    url = "api/User/AddUser";
                }
                else {
                    url = "api/User/EditUser";
                }
                let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    UserPage.GetList();
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
            let url = "api/User/DeleteUser";
            let data = {
                ID: UserPage.PageData.ID
            };
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                $('#DeleteModal').modal('toggle');
                UserPage.GetList();
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
         * 获得所有性别枚举信息
         */
        private BindAllSex() {
            let url: string = "api/User/GetAllSex";
            let data = null;
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                let sexEnumMs = resM["Data"] as Array<any>;
                let InputSex = MDMa.$("InputSex") as HTMLSelectElement;
                InputSex.innerHTML = "";
                for (var i = 0; i < sexEnumMs.length; i++) {
                    let option = new Option(sexEnumMs[i]["EnumName"], sexEnumMs[i]["EnumValue"]);
                    InputSex.options.add(option);
                }
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"])
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
            };
            common.SendGetAjax(url, data, SFun, FFun, CFun);
        }
        /**
         * 设置用户组信息按钮单击事件
         * @param e
         */
        private static BtnSetUserGroupEvent_Click(e: MouseEvent) {
            let BtnElement = e.target as HTMLButtonElement;
            BtnElement.disabled = true;
            let url = "api/User/GetUserGroupByUserID";
            let data = {
                UserID: BtnElement.dataset.id
            };
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                let UserGroupList = MDMa.$("UserGroupList");
                UserGroupList.innerHTML = "";
                for (var i = 0; i < resM["Data"]["length"]; i++) {
                    let li = document.createElement("li");
                    let text = document.createTextNode(resM["Data"][i]["Name"]);
                    let button = document.createElement("button");
                    MDMa.AddClass(button, "btn btn-danger btn-xs");
                    button.textContent = "移除";
                    button.dataset.id = resM["Data"][i]["ID"];
                    MDMa.AddEvent(button, "click", UserPage.RemoveUserGroupBtnEvent);
                    li.appendChild(text);
                    li.appendChild(button);
                    UserGroupList.appendChild(li);
                }
                $('#UserGroupModal').modal('toggle');
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
         * 查询用户组按钮
         * @param e
         */
        private static BtnUserGroupSearchEvent_Click(e: MouseEvent) {
            let SearchUserGroupForm = document.forms["SearchUserGroupForm"] as HTMLFormElement;
            if (!MTMa.IsNullOrUndefined(SearchUserGroupForm) && SearchUserGroupForm.checkValidity()) {
                let BtnElement = e.target as HTMLButtonElement;
                BtnElement.disabled = true;
                let url = "api/UserGroup/GetUserGroupByName";
                let data = {
                    Name: MDMa.GetInputValue("SearchUserGroupName")
                };
                let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    console.log(resM);
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
         * 移除职务按钮事件
         * @param e 触发对象
         */
        public static RemoveUserGroupBtnEvent(e: MouseEvent) {
            //let EditBtn = e.target as HTMLButtonElement;
            //let postID = EditBtn.dataset["id"];
            //let url: string = "api/UserUserGroup/RemoveUserGroup";
            //let data = {
            //    UserID: UserPage.PageData.EditID,
            //    UserGroupID: postID
            //};
            //let SFun = function (resM: Object) {
            //    if (resM["ResultType"] == 0) {
            //        UserPage.GetViewUserUserGroupInfoByUserID();
            //    }
            //    else {
            //        common.ShowMessage("移除失败:" + resM["Message"], 0, "UserGroupMessageBox");
            //    }
            //};
            //let EFun = function (xhr: XMLHttpRequest, resM: Object) {
            //    if (xhr.status == 403) {
            //        common.ShowMessage("操作失败,您的权限不足", 3);
            //    }
            //};
            //let CFun = function (resM: Object) {
            //};
            //common.SendAjax(url, data, SFun, EFun, CFun);
        }
        /**
         * 添加职务按钮事件
         * @param e 触发对象
         */
        public static AddUserGroupBtnEvent(e: MouseEvent) {
            //let EditBtn = e.target as HTMLButtonElement;
            //let postID = EditBtn.dataset["id"];
            //let url: string = "api/UserUserGroup/AddUserGroup";
            //let data = {
            //    UserID: UserPage.PageData.EditID,
            //    UserGroupID: postID
            //};
            //let SFun = function (resM: Object) {
            //    if (resM["ResultType"] == 0) {
            //        UserPage.GetViewUserUserGroupInfoByUserID();
            //    }
            //    else {
            //        common.ShowMessage("添加失败:" + resM["Message"], 0, "UserGroupMessageBox");
            //    }
            //};
            //let EFun = function (xhr: XMLHttpRequest, resM: Object) {
            //    if (xhr.status == 403) {
            //        common.ShowMessage("操作失败,您的权限不足", 3);
            //    }
            //};
            //let CFun = function (resM: Object) {
            //};
            //common.SendAjax(url, data, SFun, EFun, CFun);
        }
    }
    /**
     * 用户查询模型
     */
    class UserSearchModel {
        public UserName: string;
        public Mobile: string;
        public WeChatWorkUserID: string;
        public Email: string;
        public TrueName: string;
        public NickName: string;
        public IfEnable: boolean;
        public PageIndex: number;
        public PageSize: number;
        /**
         * 获得输入模型
         */
        public static GetInputData(): UserSearchModel {
            let data: UserSearchModel = {
                UserName: MDMa.GetInputValue("SearchUserName"),
                Mobile: MDMa.GetInputValue("SearchMobile"),
                WeChatWorkUserID: MDMa.GetInputValue("SearchWeChatWorkUserID"),
                Email: MDMa.GetInputValue("SearchEmail"),
                TrueName: MDMa.GetInputValue("SearchTrueName"),
                NickName: MDMa.GetInputValue("SearchNickName"),
                IfEnable: MDMa.GetInputValue("SearchIfEnable"),
                PageIndex: common.PagingM.PageModel.PagingIndex,
                PageSize: common.PagingM.PageModel.PagingSize,
            };
            return data;
        }
    }
    /**
     * 用户输入模型
     */
    class UserInputModel {
        /*唯一标识*/
        public ID: string;
        /*用户名*/
        public UserName: string;
        /*手机号码*/
        public Mobile: string;
        /*企业微信账户*/
        public WeChatWorkUserID: string;
        /*邮箱*/
        public Email: string;
        /*真实姓名*/
        public TrueName: string;
        /*昵称*/
        public NickName: string;
        /*性别*/
        public Sex: number;
        /*启用标识*/
        public IfEnable: boolean;
        /**
         * 获得输入模型
         */
        public static GetInputData(): UserInputModel {
            let data: UserInputModel = null;
            let InputForm = document.forms["InputForm"] as HTMLFormElement;
            if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                data = {
                    ID: UserPage.PageData.ID,
                    UserName: MDMa.GetInputValue("InputUserName"),
                    Mobile: MDMa.GetInputValue("InputMobile"),
                    WeChatWorkUserID: MDMa.GetInputValue("InputWeChatWorkUserID"),
                    Email: MDMa.GetInputValue("InputEmail"),
                    TrueName: MDMa.GetInputValue("InputTrueName"),
                    NickName: MDMa.GetInputValue("InputNickName"),
                    Sex: MDMa.GetInputValue("InputSex"),
                    IfEnable: (MDMa.$("InputIfEnable") as HTMLInputElement).checked,
                };
            }
            return data;
        }
    }
    /*页面加载完成时触发*/
    MDMa.AddEvent(window, "load", function () {
        let pageM = new UserPage();
    });
}