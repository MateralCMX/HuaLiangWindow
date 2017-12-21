/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
var HuaLiangWindow;
(function (HuaLiangWindow) {
    var Backstage;
    (function (Backstage) {
        /**
         * 用户组页面
         */
        var UserPage = (function () {
            /**
             * 构造方法
             */
            function UserPage() {
                if (HuaLiangWindow.common.IsLogin(true)) {
                    UserPage.GetList();
                    this.BindAllUserGroupType();
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
                MDMa.AddEvent("BtnSaveUserGroup", "click", this.BtnSaveUserGroupEvent_Click);
                MDMa.AddEvent("InputName", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputCode", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputIntroduction", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("SearchUserGroupType", "change", this.SearchUserGroupTypeEvent_Change);
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
                        var Name = document.createElement("td");
                        Name.textContent = listM[i]["Name"];
                        Item.appendChild(Name);
                        var Code = document.createElement("td");
                        Code.textContent = listM[i]["Code"];
                        Item.appendChild(Code);
                        var Introduction = document.createElement("td");
                        Introduction.textContent = listM[i]["Introduction"];
                        Item.appendChild(Introduction);
                        var IfEnable = document.createElement("td");
                        IfEnable.textContent = listM[i]["IfEnable"] ? "启用" : "禁用";
                        Item.appendChild(IfEnable);
                        var Operation = document.createElement("td");
                        var OperationBtnGroup = document.createElement("div");
                        MDMa.AddClass(OperationBtnGroup, "btn-group");
                        var SetUserGroupBtn = document.createElement("button");
                        MDMa.AddClass(SetUserGroupBtn, "btn btn-primary");
                        SetUserGroupBtn.setAttribute("type", "button");
                        SetUserGroupBtn.textContent = "设置权限";
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
             * 根据ID获得用户组信息
             * @param ID
             */
            UserPage.GetUserInfoByID = function () {
                var url = "api/User/GetUserInfoByID";
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
                    $('#EditModal').modal('toggle');
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
             * 获得所有权限类型枚举信息
             */
            UserPage.prototype.BindAllUserGroupType = function () {
                var url = "api/UserGroup/GetAllUserGroupType";
                var data = null;
                var SFun = function (resM, xhr, state) {
                    var permissionsEnumMs = resM["Data"];
                    var SearchUserGroupType = MDMa.$("SearchUserGroupType");
                    SearchUserGroupType.innerHTML = "";
                    for (var i = 0; i < permissionsEnumMs.length; i++) {
                        var option = new Option(permissionsEnumMs[i]["EnumName"], permissionsEnumMs[i]["EnumValue"]);
                        SearchUserGroupType.options.add(option);
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
             * 查询权限类型更改事件
             * @param e
             */
            UserPage.prototype.SearchUserGroupTypeEvent_Change = function (e) {
                var SearchUserGroupType = e.target;
                var formGroups = document.getElementsByName("UserGroupTypeGroup");
                var formGroup = document.getElementById("UserGroupTypeGroup" + SearchUserGroupType.value);
                if (formGroup) {
                    for (var i = 0; i < formGroups.length; i++) {
                        MDMa.AddClass(formGroups[i], "Close");
                    }
                    MDMa.RemoveClass(formGroup, "Close");
                }
            };
            /**
             * 设置权限信息按钮单击事件
             * @param e
             */
            UserPage.BtnSetUserGroupEvent_Click = function (e) {
                var BtnElement = e.target;
                BtnElement.disabled = true;
                var url = "api/UserGroup/GetEnableUserGroupInfoByUserID";
                var data = {
                    UserID: BtnElement.dataset.id
                };
                var SFun = function (resM, xhr, state) {
                    UserPage.PageData.ID = BtnElement.dataset.id;
                    var UserGroupList = MDMa.$("UserGroupList");
                    UserGroupList.innerHTML = "";
                    for (var i = 0; i < resM["Data"]["length"]; i++) {
                        var formGroup = UserPage.GetUserGroupGroup(resM["Data"][i]);
                        UserGroupList.appendChild(formGroup);
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
             * 获得权限组
             * @param listM
             */
            UserPage.GetUserGroupGroup = function (listM) {
                var SearchUserGroupType = MDMa.$("SearchUserGroupType");
                var formGroup = document.createElement("div");
                MDMa.AddClass(formGroup, "form-group");
                formGroup.setAttribute("id", "UserGroupTypeGroup" + listM["Type"]);
                formGroup.setAttribute("name", "UserGroupTypeGroup");
                if (SearchUserGroupType.value != listM["Type"]) {
                    MDMa.AddClass(formGroup, "Close");
                }
                var btnGroup = document.createElement("div");
                MDMa.AddClass(btnGroup, "btn-group");
                var BtnCheckAll = document.createElement("button");
                BtnCheckAll.setAttribute("type", "button");
                MDMa.AddClass(BtnCheckAll, "btn btn-default btn-xs");
                BtnCheckAll.textContent = "全选";
                MDMa.AddEvent(BtnCheckAll, "click", UserPage.CheckAll);
                var BtnCheckInvert = document.createElement("button");
                BtnCheckInvert.setAttribute("type", "button");
                MDMa.AddClass(BtnCheckInvert, "btn btn-default btn-xs");
                BtnCheckInvert.textContent = "反选";
                MDMa.AddEvent(BtnCheckInvert, "click", UserPage.CheckInvert);
                btnGroup.appendChild(BtnCheckAll);
                btnGroup.appendChild(BtnCheckInvert);
                formGroup.appendChild(btnGroup);
                var ul = UserPage.GetUserGroupList(listM["Items"]);
                MDMa.AddClass(ul, "UserGroupList");
                formGroup.appendChild(ul);
                return formGroup;
            };
            /**
             * 获得权限列表
             */
            UserPage.GetUserGroupList = function (listM) {
                var ul = document.createElement("ul");
                for (var i = 0; i < listM["length"]; i++) {
                    var li = document.createElement("li");
                    var input = document.createElement("input");
                    input.setAttribute("type", "checkbox");
                    input.value = listM[i]["ID"];
                    input.checked = listM[i]["IsHas"];
                    li.appendChild(input);
                    li.appendChild(document.createTextNode(listM[i]["Name"]));
                    if (listM[i]["Items"] != null) {
                        var div = document.createElement("div");
                        MDMa.AddClass(div, "btn-group");
                        var BtnCheckAll = document.createElement("button");
                        MDMa.AddClass(BtnCheckAll, "btn btn-default btn-xs");
                        BtnCheckAll.setAttribute("type", "button");
                        BtnCheckAll.textContent = "全选";
                        MDMa.AddEvent(BtnCheckAll, "click", UserPage.CheckAll);
                        var BtnCheckInvert = document.createElement("button");
                        BtnCheckInvert.setAttribute("type", "button");
                        MDMa.AddClass(BtnCheckInvert, "btn btn-default btn-xs");
                        BtnCheckInvert.textContent = "反选";
                        MDMa.AddEvent(BtnCheckInvert, "click", UserPage.CheckInvert);
                        div.appendChild(BtnCheckAll);
                        div.appendChild(BtnCheckInvert);
                        var subUl = UserPage.GetUserGroupList(listM[i]["Items"]);
                        li.appendChild(div);
                        li.appendChild(subUl);
                    }
                    ul.appendChild(li);
                }
                return ul;
            };
            /**
             * 全选
             * @param e
             */
            UserPage.CheckAll = function (e) {
                var BtnElement = e.target;
                var inputs = BtnElement.parentElement.parentElement.getElementsByTagName("input");
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].checked = true;
                }
            };
            /**
             * 反选
             * @param e
             */
            UserPage.CheckInvert = function (e) {
                var BtnElement = e.target;
                var inputs = BtnElement.parentElement.parentElement.getElementsByTagName("input");
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].checked = !inputs[i].checked;
                }
            };
            /**
             * 保存权限按钮单击事件
             * @param e
             */
            UserPage.prototype.BtnSaveUserGroupEvent_Click = function (e) {
                var BtnElement = e.target;
                BtnElement.textContent = "保存中......";
                BtnElement.disabled = true;
                var UserGroup = [];
                var UserGroupList = MDMa.$("UserGroupList");
                var inputs = UserGroupList.getElementsByTagName("input");
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i].type == "checkbox" && inputs[i].checked) {
                        UserGroup.push(inputs[i].value);
                    }
                }
                var url = "api/User/SaveUserGroup";
                var data = {
                    UserID: UserPage.PageData.ID,
                    UserGroupIDs: UserGroup
                };
                var SFun = function (resM, xhr, state) {
                    $('#UserGroupModal').modal('toggle');
                };
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                    BtnElement.textContent = "保存";
                    BtnElement.disabled = false;
                };
                HuaLiangWindow.common.SendPostAjax(url, data, SFun, FFun, CFun);
            };
            return UserPage;
        }());
        /*页面数据*/
        UserPage.PageData = {
            ID: null
        };
        /**
         * 用户组查询模型
         */
        var UserSearchModel = (function () {
            function UserSearchModel() {
            }
            /**
             * 获得输入模型
             */
            UserSearchModel.GetInputData = function () {
                var data = {
                    Name: MDMa.GetInputValue("SearchName"),
                    Code: MDMa.GetInputValue("SearchCode"),
                    IfEnable: MDMa.GetInputValue("SearchIfEnable"),
                    PageIndex: HuaLiangWindow.common.PagingM.PageModel.PagingIndex,
                    PageSize: HuaLiangWindow.common.PagingM.PageModel.PagingSize,
                };
                return data;
            };
            return UserSearchModel;
        }());
        /**
         * 用户组输入模型
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
                        Name: MDMa.GetInputValue("InputName"),
                        Code: MDMa.GetInputValue("InputCode"),
                        Introduction: MDMa.GetInputValue("InputIntroduction"),
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
//# sourceMappingURL=UserGroup.js.map