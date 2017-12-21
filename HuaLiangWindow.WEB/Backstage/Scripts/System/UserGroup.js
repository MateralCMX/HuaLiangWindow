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
        var UserGroupPage = (function () {
            /**
             * 构造方法
             */
            function UserGroupPage() {
                if (HuaLiangWindow.common.IsLogin(true)) {
                    UserGroupPage.GetList();
                    this.BindAllPermissionsType();
                    this.BindEvent();
                }
            }
            /**
             * 绑定事件
             */
            UserGroupPage.prototype.BindEvent = function () {
                MDMa.AddEvent("BtnSearch", "click", this.BtnSearchEvent_Click);
                MDMa.AddEvent("BtnAdd", "click", UserGroupPage.BtnAddEvent_Click);
                MDMa.AddEvent("BtnSave", "click", this.BtnSaveEvent_Click);
                MDMa.AddEvent("BtnDelete", "click", this.BtnDeleteEvent_Click);
                MDMa.AddEvent("BtnSavePermissions", "click", this.BtnSavePermissionsEvent_Click);
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
                MDMa.AddEvent("SearchPermissionsType", "change", this.SearchPermissionsTypeEvent_Change);
            };
            /**
             * 获得列表
             */
            UserGroupPage.GetList = function () {
                if (HuaLiangWindow.common.PagingM.PageModel.PagingIndex <= HuaLiangWindow.common.PagingM.PageModel.PagingCount) {
                    var url = "api/UserGroup/GetUserGroupInfoByWhere";
                    var data = UserGroupSearchModel.GetInputData();
                    var SFun = function (resM, xhr, state) {
                        UserGroupPage.BindListInfo(resM["Data"]);
                        HuaLiangWindow.common.BindPageInfo(resM["PagingInfo"], UserGroupPage.GetList);
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
            UserGroupPage.BindListInfo = function (listM) {
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
                        var SetPermissionsBtn = document.createElement("button");
                        MDMa.AddClass(SetPermissionsBtn, "btn btn-primary");
                        SetPermissionsBtn.setAttribute("type", "button");
                        SetPermissionsBtn.textContent = "设置权限";
                        MDMa.AddEvent(SetPermissionsBtn, "click", UserGroupPage.BtnSetPermissionsEvent_Click);
                        SetPermissionsBtn.dataset.id = listM[i]["ID"];
                        OperationBtnGroup.appendChild(SetPermissionsBtn);
                        var EditBtn = document.createElement("button");
                        MDMa.AddClass(EditBtn, "btn btn-default");
                        EditBtn.setAttribute("type", "button");
                        EditBtn.textContent = "编辑";
                        MDMa.AddEvent(EditBtn, "click", UserGroupPage.BtnEditEvent_Click);
                        EditBtn.dataset.id = listM[i]["ID"];
                        OperationBtnGroup.appendChild(EditBtn);
                        var RemoveBtn = document.createElement("button");
                        MDMa.AddClass(RemoveBtn, "btn btn-danger");
                        RemoveBtn.setAttribute("type", "button");
                        RemoveBtn.textContent = "删除";
                        RemoveBtn.dataset.toggle = "modal";
                        RemoveBtn.dataset.target = "#DeleteModal";
                        MDMa.AddEvent(RemoveBtn, "click", UserGroupPage.BtnRemoveEvent_Click);
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
            UserGroupPage.prototype.BtnSearchEvent_Click = function (e) {
                HuaLiangWindow.common.PagingM.PageModel.PagingIndex = 1;
                HuaLiangWindow.common.PagingM.PageModel.PagingCount = 99;
                UserGroupPage.GetList();
            };
            /**
             * 新增按钮单击事件
             */
            UserGroupPage.BtnAddEvent_Click = function (e) {
                var btnElement = e.target;
                HuaLiangWindow.common.ClearModalForm("EditModal");
                var EditModalLabel = MDMa.$("EditModalLabel");
                EditModalLabel.textContent = "新增";
                UserGroupPage.PageData.ID = null;
            };
            /**
             * 编辑按钮单击事件
             */
            UserGroupPage.BtnEditEvent_Click = function (e) {
                var btnElement = e.target;
                HuaLiangWindow.common.ClearModalForm("EditModal");
                var EditModalLabel = MDMa.$("EditModalLabel");
                EditModalLabel.textContent = "新增";
                UserGroupPage.PageData.ID = btnElement.dataset.id;
                UserGroupPage.GetUserGroupInfoByID();
            };
            /**
             * 移除按钮单击事件
             */
            UserGroupPage.BtnRemoveEvent_Click = function (e) {
                var btnElement = e.target;
                UserGroupPage.PageData.ID = btnElement.dataset.id;
            };
            /**
             * 根据ID获得用户组信息
             * @param ID
             */
            UserGroupPage.GetUserGroupInfoByID = function () {
                var url = "api/UserGroup/GetUserGroupInfoByID";
                var data = {
                    ID: UserGroupPage.PageData.ID
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
            UserGroupPage.prototype.BtnSaveEvent_Click = function (e) {
                HuaLiangWindow.common.ClearErrorMessage();
                var data = UserGroupInputModel.GetInputData();
                if (data != null) {
                    var BtnElement_1 = e.target;
                    BtnElement_1.textContent = "保存中......";
                    BtnElement_1.disabled = true;
                    var url = void 0;
                    if (MTMa.IsNullOrUndefinedOrEmpty(UserGroupPage.PageData.ID)) {
                        url = "api/UserGroup/AddUserGroup";
                    }
                    else {
                        url = "api/UserGroup/EditUserGroup";
                    }
                    var SFun = function (resM, xhr, state) {
                        UserGroupPage.GetList();
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
            UserGroupPage.prototype.BtnDeleteEvent_Click = function (e) {
                var BtnElement = e.target;
                BtnElement.textContent = "删除中......";
                BtnElement.disabled = true;
                var url = "api/UserGroup/DeleteUserGroup";
                var data = {
                    ID: UserGroupPage.PageData.ID
                };
                var SFun = function (resM, xhr, state) {
                    $('#DeleteModal').modal('toggle');
                    UserGroupPage.GetList();
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
            UserGroupPage.prototype.BindAllPermissionsType = function () {
                var url = "api/Permissions/GetAllPermissionsType";
                var data = null;
                var SFun = function (resM, xhr, state) {
                    var permissionsEnumMs = resM["Data"];
                    var SearchPermissionsType = MDMa.$("SearchPermissionsType");
                    SearchPermissionsType.innerHTML = "";
                    for (var i = 0; i < permissionsEnumMs.length; i++) {
                        var option = new Option(permissionsEnumMs[i]["EnumName"], permissionsEnumMs[i]["EnumValue"]);
                        SearchPermissionsType.options.add(option);
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
            UserGroupPage.prototype.SearchPermissionsTypeEvent_Change = function (e) {
                var SearchPermissionsType = e.target;
                var formGroups = document.getElementsByName("PermissionsTypeGroup");
                var formGroup = document.getElementById("PermissionsTypeGroup" + SearchPermissionsType.value);
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
            UserGroupPage.BtnSetPermissionsEvent_Click = function (e) {
                var BtnElement = e.target;
                BtnElement.disabled = true;
                var url = "api/Permissions/GetEnablePermissionsInfoByUserGroupID";
                var data = {
                    UserGroupID: BtnElement.dataset.id
                };
                var SFun = function (resM, xhr, state) {
                    UserGroupPage.PageData.ID = BtnElement.dataset.id;
                    var PermissionsList = MDMa.$("PermissionsList");
                    PermissionsList.innerHTML = "";
                    for (var i = 0; i < resM["Data"]["length"]; i++) {
                        var formGroup = UserGroupPage.GetPermissionsGroup(resM["Data"][i]);
                        PermissionsList.appendChild(formGroup);
                    }
                    $('#PermissionsModal').modal('toggle');
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
            UserGroupPage.GetPermissionsGroup = function (listM) {
                var SearchPermissionsType = MDMa.$("SearchPermissionsType");
                var formGroup = document.createElement("div");
                MDMa.AddClass(formGroup, "form-group");
                formGroup.setAttribute("id", "PermissionsTypeGroup" + listM["Type"]);
                formGroup.setAttribute("name", "PermissionsTypeGroup");
                if (SearchPermissionsType.value != listM["Type"]) {
                    MDMa.AddClass(formGroup, "Close");
                }
                var btnGroup = document.createElement("div");
                MDMa.AddClass(btnGroup, "btn-group");
                var BtnCheckAll = document.createElement("button");
                BtnCheckAll.setAttribute("type", "button");
                MDMa.AddClass(BtnCheckAll, "btn btn-default btn-xs");
                BtnCheckAll.textContent = "全选";
                MDMa.AddEvent(BtnCheckAll, "click", UserGroupPage.CheckAll);
                var BtnCheckInvert = document.createElement("button");
                BtnCheckInvert.setAttribute("type", "button");
                MDMa.AddClass(BtnCheckInvert, "btn btn-default btn-xs");
                BtnCheckInvert.textContent = "反选";
                MDMa.AddEvent(BtnCheckInvert, "click", UserGroupPage.CheckInvert);
                btnGroup.appendChild(BtnCheckAll);
                btnGroup.appendChild(BtnCheckInvert);
                formGroup.appendChild(btnGroup);
                var ul = UserGroupPage.GetPermissionsList(listM["Items"]);
                MDMa.AddClass(ul, "PermissionsList");
                formGroup.appendChild(ul);
                return formGroup;
            };
            /**
             * 获得权限列表
             */
            UserGroupPage.GetPermissionsList = function (listM) {
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
                        MDMa.AddEvent(BtnCheckAll, "click", UserGroupPage.CheckAll);
                        var BtnCheckInvert = document.createElement("button");
                        BtnCheckInvert.setAttribute("type", "button");
                        MDMa.AddClass(BtnCheckInvert, "btn btn-default btn-xs");
                        BtnCheckInvert.textContent = "反选";
                        MDMa.AddEvent(BtnCheckInvert, "click", UserGroupPage.CheckInvert);
                        div.appendChild(BtnCheckAll);
                        div.appendChild(BtnCheckInvert);
                        var subUl = UserGroupPage.GetPermissionsList(listM[i]["Items"]);
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
            UserGroupPage.CheckAll = function (e) {
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
            UserGroupPage.CheckInvert = function (e) {
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
            UserGroupPage.prototype.BtnSavePermissionsEvent_Click = function (e) {
                var BtnElement = e.target;
                BtnElement.textContent = "保存中......";
                BtnElement.disabled = true;
                var Permissions = [];
                var PermissionsList = MDMa.$("PermissionsList");
                var inputs = PermissionsList.getElementsByTagName("input");
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i].type == "checkbox" && inputs[i].checked) {
                        Permissions.push(inputs[i].value);
                    }
                }
                var url = "api/UserGroup/SavePermissions";
                var data = {
                    UserGroupID: UserGroupPage.PageData.ID,
                    PermissionsIDs: Permissions
                };
                var SFun = function (resM, xhr, state) {
                    $('#PermissionsModal').modal('toggle');
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
            return UserGroupPage;
        }());
        /*页面数据*/
        UserGroupPage.PageData = {
            ID: null
        };
        /**
         * 用户组查询模型
         */
        var UserGroupSearchModel = (function () {
            function UserGroupSearchModel() {
            }
            /**
             * 获得输入模型
             */
            UserGroupSearchModel.GetInputData = function () {
                var data = {
                    Name: MDMa.GetInputValue("SearchName"),
                    Code: MDMa.GetInputValue("SearchCode"),
                    IfEnable: MDMa.GetInputValue("SearchIfEnable"),
                    PageIndex: HuaLiangWindow.common.PagingM.PageModel.PagingIndex,
                    PageSize: HuaLiangWindow.common.PagingM.PageModel.PagingSize,
                };
                return data;
            };
            return UserGroupSearchModel;
        }());
        /**
         * 用户组输入模型
         */
        var UserGroupInputModel = (function () {
            function UserGroupInputModel() {
            }
            /**
             * 获得输入模型
             */
            UserGroupInputModel.GetInputData = function () {
                var data = null;
                var InputForm = document.forms["InputForm"];
                if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                    data = {
                        ID: UserGroupPage.PageData.ID,
                        Name: MDMa.GetInputValue("InputName"),
                        Code: MDMa.GetInputValue("InputCode"),
                        Introduction: MDMa.GetInputValue("InputIntroduction"),
                        IfEnable: MDMa.$("InputIfEnable").checked,
                    };
                }
                return data;
            };
            return UserGroupInputModel;
        }());
        /*页面加载完成时触发*/
        MDMa.AddEvent(window, "load", function () {
            var pageM = new UserGroupPage();
        });
    })(Backstage = HuaLiangWindow.Backstage || (HuaLiangWindow.Backstage = {}));
})(HuaLiangWindow || (HuaLiangWindow = {}));
//# sourceMappingURL=UserGroup.js.map