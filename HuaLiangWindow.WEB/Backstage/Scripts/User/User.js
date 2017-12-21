/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
var HuaLiangWindow;
(function (HuaLiangWindow) {
    var Backstage;
    (function (Backstage) {
        /**
         * 用户页面
         */
        var UserPage = (function () {
            /**
             * 构造方法
             */
            function UserPage() {
                if (HuaLiangWindow.common.IsLogin(true)) {
                    UserPage.GetList();
                    this.BindAllSex();
                    this.BindEvent();
                }
            }
            /**
             * 绑定事件
             */
            UserPage.prototype.BindEvent = function () {
                MDMa.AddEvent("BtnSearch", "click", this.BtnSearchEvent_Click);
                MDMa.AddEvent("BtnAdd", "click", UserPage.BtnAddEvent_Click);
                MDMa.AddEvent("BtnSave", "click", this.BtnSaveEvent_Click);
                MDMa.AddEvent("BtnDelete", "click", this.BtnDeleteEvent_Click);
                //MDMa.AddEvent("BtnSaveUserGroup", "click", this.BtnSaveUserGroupEvent_Click);
                MDMa.AddEvent("InputTrueName", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputNickName", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputUserName", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputMobile", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputEmail", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputWeChatWorkUserID", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
            };
            /**
             * 获得列表
             */
            UserPage.GetList = function () {
                if (HuaLiangWindow.common.PagingM.PageModel.PagingIndex <= HuaLiangWindow.common.PagingM.PageModel.PagingCount) {
                    var url = "api/User/GetUserInfoByWhere";
                    var data = UserSearchModel.GetInputData();
                    var SFun = function (resM, xhr, state) {
                        UserPage.BindListInfo(resM["Data"]);
                        HuaLiangWindow.common.BindPageInfo(resM["PagingInfo"], UserPage.GetList);
                    };
                    var FFun = function (resM, xhr, state) {
                        HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                    };
                    var CFun = function (resM, xhr, state) {
                    };
                    HuaLiangWindow.common.SendGetAjax(url, data, SFun, FFun, CFun);
                }
            };
            /**
             * 绑定列表信息
             * @param listM
             */
            UserPage.BindListInfo = function (listM) {
                var DataTable = MDMa.$("DataTable");
                DataTable.innerHTML = "";
                if (!MTMa.IsNullOrUndefined(listM)) {
                    for (var i = 0; i < listM.length; i++) {
                        var Item = document.createElement("tr");
                        var Index = document.createElement("td");
                        Index.textContent = (HuaLiangWindow.common.PagingM.PageModel.PagingSize * (HuaLiangWindow.common.PagingM.PageModel.PagingIndex - 1) + i + 1).toString();
                        Item.appendChild(Index);
                        var TrueName = document.createElement("td");
                        TrueName.textContent = listM[i]["TrueName"];
                        Item.appendChild(TrueName);
                        var NickName = document.createElement("td");
                        NickName.textContent = listM[i]["NickName"];
                        Item.appendChild(NickName);
                        var Email = document.createElement("td");
                        Email.textContent = listM[i]["Email"];
                        Item.appendChild(Email);
                        var Mobile = document.createElement("td");
                        Mobile.textContent = listM[i]["Mobile"];
                        Item.appendChild(Mobile);
                        var UserName = document.createElement("td");
                        UserName.textContent = listM[i]["UserName"];
                        Item.appendChild(UserName);
                        var IfEnable = document.createElement("td");
                        IfEnable.textContent = listM[i]["IfEnable"] ? "启用" : "禁用";
                        Item.appendChild(IfEnable);
                        var Operation = document.createElement("td");
                        var OperationBtnGroup = document.createElement("div");
                        MDMa.AddClass(OperationBtnGroup, "btn-group");
                        var SetUserGroupBtn = document.createElement("button");
                        MDMa.AddClass(SetUserGroupBtn, "btn btn-primary");
                        SetUserGroupBtn.setAttribute("type", "button");
                        SetUserGroupBtn.textContent = "设置用户组";
                        MDMa.AddEvent(SetUserGroupBtn, "click", UserPage.BtnSetUserGroupEvent_Click);
                        SetUserGroupBtn.dataset.id = listM[i]["ID"];
                        OperationBtnGroup.appendChild(SetUserGroupBtn);
                        var EditBtn = document.createElement("button");
                        MDMa.AddClass(EditBtn, "btn btn-default");
                        EditBtn.setAttribute("type", "button");
                        EditBtn.textContent = "编辑";
                        MDMa.AddEvent(EditBtn, "click", UserPage.BtnEditEvent_Click);
                        EditBtn.dataset.id = listM[i]["ID"];
                        OperationBtnGroup.appendChild(EditBtn);
                        var RemoveBtn = document.createElement("button");
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
            };
            /**
             * 查询按钮
             * @param e
             */
            UserPage.prototype.BtnSearchEvent_Click = function (e) {
                HuaLiangWindow.common.PagingM.PageModel.PagingIndex = 1;
                HuaLiangWindow.common.PagingM.PageModel.PagingCount = 99;
                UserPage.GetList();
            };
            /**
             * 新增按钮单击事件
             */
            UserPage.BtnAddEvent_Click = function (e) {
                var btnElement = e.target;
                HuaLiangWindow.common.ClearModalForm("EditModal");
                var EditModalLabel = MDMa.$("EditModalLabel");
                EditModalLabel.textContent = "新增";
                UserPage.PageData.ID = null;
            };
            /**
             * 编辑按钮单击事件
             */
            UserPage.BtnEditEvent_Click = function (e) {
                var btnElement = e.target;
                HuaLiangWindow.common.ClearModalForm("EditModal");
                var EditModalLabel = MDMa.$("EditModalLabel");
                EditModalLabel.textContent = "新增";
                UserPage.PageData.ID = btnElement.dataset.id;
                UserPage.GetUserInfoByID();
            };
            /**
             * 移除按钮单击事件
             */
            UserPage.BtnRemoveEvent_Click = function (e) {
                var btnElement = e.target;
                UserPage.PageData.ID = btnElement.dataset.id;
            };
            /**
             * 根据ID获得用户信息
             * @param ID
             */
            UserPage.GetUserInfoByID = function () {
                var url = "api/User/GetUserViewInfoByID";
                var data = {
                    ID: UserPage.PageData.ID
                };
                var SFun = function (resM, xhr, state) {
                    var perM = resM["Data"];
                    HuaLiangWindow.common.BindInputInfo(perM);
                    $('#EditModal').modal('toggle');
                };
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                };
                HuaLiangWindow.common.SendGetAjax(url, data, SFun, FFun, CFun);
            };
            /**
             * 保存按钮单击事件
             * @param e
             */
            UserPage.prototype.BtnSaveEvent_Click = function (e) {
                HuaLiangWindow.common.ClearErrorMessage();
                var data = UserInputModel.GetInputData();
                if (data != null) {
                    var BtnElement_1 = e.target;
                    BtnElement_1.textContent = "保存中......";
                    BtnElement_1.disabled = true;
                    var url = void 0;
                    if (MTMa.IsNullOrUndefinedOrEmpty(UserPage.PageData.ID)) {
                        url = "api/User/AddUser";
                    }
                    else {
                        url = "api/User/EditUser";
                    }
                    var SFun = function (resM, xhr, state) {
                        UserPage.GetList();
                        $('#EditModal').modal('toggle');
                    };
                    var FFun = function (resM, xhr, state) {
                        HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                    };
                    var CFun = function (resM, xhr, state) {
                        BtnElement_1.textContent = "保存";
                        BtnElement_1.disabled = false;
                    };
                    HuaLiangWindow.common.SendPostAjax(url, data, SFun, FFun, CFun);
                }
            };
            /**
             * 删除按钮单击事件
             * @param e
             */
            UserPage.prototype.BtnDeleteEvent_Click = function (e) {
                var BtnElement = e.target;
                BtnElement.textContent = "删除中......";
                BtnElement.disabled = true;
                var url = "api/User/DeleteUser";
                var data = {
                    ID: UserPage.PageData.ID
                };
                var SFun = function (resM, xhr, state) {
                    $('#DeleteModal').modal('toggle');
                    UserPage.GetList();
                };
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                    BtnElement.textContent = "删除";
                    BtnElement.disabled = false;
                };
                HuaLiangWindow.common.SendPostAjax(url, data, SFun, FFun, CFun);
            };
            /**
             * 获得所有性别枚举信息
             */
            UserPage.prototype.BindAllSex = function () {
                var url = "api/User/GetAllSex";
                var data = null;
                var SFun = function (resM, xhr, state) {
                    var sexEnumMs = resM["Data"];
                    var InputSex = MDMa.$("InputSex");
                    InputSex.innerHTML = "";
                    for (var i = 0; i < sexEnumMs.length; i++) {
                        var option = new Option(sexEnumMs[i]["EnumName"], sexEnumMs[i]["EnumValue"]);
                        InputSex.options.add(option);
                    }
                };
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                };
                HuaLiangWindow.common.SendGetAjax(url, data, SFun, FFun, CFun);
            };
            /**
             * 设置用户组信息按钮单击事件
             * @param e
             */
            UserPage.BtnSetUserGroupEvent_Click = function (e) {
                var BtnElement = e.target;
                BtnElement.disabled = true;
                var url = "api/User/GetUserGroupByUserID";
                var data = {
                    UserID: BtnElement.dataset.id
                };
                var SFun = function (resM, xhr, state) {
                    var UserGroupList = MDMa.$("UserGroupList");
                    UserGroupList.innerHTML = "";
                    for (var i = 0; i < resM["Data"]["length"]; i++) {
                        var li = document.createElement("li");
                        var text = document.createTextNode(resM["Data"][i]["Name"]);
                        var button = document.createElement("button");
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
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                    BtnElement.disabled = false;
                };
                HuaLiangWindow.common.SendGetAjax(url, data, SFun, FFun, CFun);
            };
            /**
             * 查询用户组按钮
             * @param e
             */
            UserPage.BtnUserGroupSearchEvent_Click = function (e) {
                var SearchUserGroupForm = document.forms["SearchUserGroupForm"];
                if (!MTMa.IsNullOrUndefined(SearchUserGroupForm) && SearchUserGroupForm.checkValidity()) {
                    var BtnElement_2 = e.target;
                    BtnElement_2.disabled = true;
                    var url = "api/UserGroup/GetUserGroupByName";
                    var data = {
                        Name: MDMa.GetInputValue("SearchUserGroupName")
                    };
                    var SFun = function (resM, xhr, state) {
                        console.log(resM);
                    };
                    var FFun = function (resM, xhr, state) {
                        HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                    };
                    var CFun = function (resM, xhr, state) {
                        BtnElement_2.disabled = false;
                    };
                    HuaLiangWindow.common.SendGetAjax(url, data, SFun, FFun, CFun);
                }
            };
            /**
             * 移除职务按钮事件
             * @param e 触发对象
             */
            UserPage.RemoveUserGroupBtnEvent = function (e) {
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
            };
            /**
             * 添加职务按钮事件
             * @param e 触发对象
             */
            UserPage.AddUserGroupBtnEvent = function (e) {
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
            };
            return UserPage;
        }());
        /*页面数据*/
        UserPage.PageData = {
            ID: null
        };
        /**
         * 用户查询模型
         */
        var UserSearchModel = (function () {
            function UserSearchModel() {
            }
            /**
             * 获得输入模型
             */
            UserSearchModel.GetInputData = function () {
                var data = {
                    UserName: MDMa.GetInputValue("SearchUserName"),
                    Mobile: MDMa.GetInputValue("SearchMobile"),
                    WeChatWorkUserID: MDMa.GetInputValue("SearchWeChatWorkUserID"),
                    Email: MDMa.GetInputValue("SearchEmail"),
                    TrueName: MDMa.GetInputValue("SearchTrueName"),
                    NickName: MDMa.GetInputValue("SearchNickName"),
                    IfEnable: MDMa.GetInputValue("SearchIfEnable"),
                    PageIndex: HuaLiangWindow.common.PagingM.PageModel.PagingIndex,
                    PageSize: HuaLiangWindow.common.PagingM.PageModel.PagingSize,
                };
                return data;
            };
            return UserSearchModel;
        }());
        /**
         * 用户输入模型
         */
        var UserInputModel = (function () {
            function UserInputModel() {
            }
            /**
             * 获得输入模型
             */
            UserInputModel.GetInputData = function () {
                var data = null;
                var InputForm = document.forms["InputForm"];
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
                        IfEnable: MDMa.$("InputIfEnable").checked,
                    };
                }
                return data;
            };
            return UserInputModel;
        }());
        /*页面加载完成时触发*/
        MDMa.AddEvent(window, "load", function () {
            var pageM = new UserPage();
        });
    })(Backstage = HuaLiangWindow.Backstage || (HuaLiangWindow.Backstage = {}));
})(HuaLiangWindow || (HuaLiangWindow = {}));
//# sourceMappingURL=User.js.map