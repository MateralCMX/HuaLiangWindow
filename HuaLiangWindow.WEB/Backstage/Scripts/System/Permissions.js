/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
var HuaLiangWindow;
(function (HuaLiangWindow) {
    var Backstage;
    (function (Backstage) {
        /**
         * 权限页面
         */
        var PermissionsPage = (function () {
            /**
             * 构造方法
             */
            function PermissionsPage() {
                if (HuaLiangWindow.common.IsLogin(true)) {
                    this.BindAllPermissionsType();
                    this.BindEvent();
                }
            }
            /**
             * 绑定事件
             */
            PermissionsPage.prototype.BindEvent = function () {
                MDMa.AddEvent("BtnAdd", "click", PermissionsPage.BtnAddEvent_Click);
                MDMa.AddEvent("BtnSave", "click", this.BtnSaveEvent_Click);
                MDMa.AddEvent("BtnDelete", "click", this.BtnDeleteEvent_Click);
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
                MDMa.AddEvent("InputIco", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
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
             * 更改类型事件
             * @param e
             */
            PermissionsPage.prototype.SearchPermissionsTypeEvent_Change = function (e) {
                PermissionsPage.GetPermissionsInfoByType();
            };
            /**
             * 获得所有权限类型枚举信息
             */
            PermissionsPage.prototype.BindAllPermissionsType = function () {
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
                    PermissionsPage.GetPermissionsInfoByType();
                };
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                };
                HuaLiangWindow.common.SendGetAjax(url, data, SFun, FFun, CFun);
            };
            /**
             * 根据类型获得权限信息
             */
            PermissionsPage.GetPermissionsInfoByType = function () {
                var url = "api/Permissions/GetPermissionsInfoByType";
                var data = {
                    Type: MDMa.GetInputValue("SearchPermissionsType")
                };
                var SFun = function (resM, xhr, state) {
                    var TreeList = MDMa.$("TreeList");
                    TreeList.innerHTML = "";
                    var treeElement = PermissionsPage.GetTreeElement(resM["Data"]);
                    TreeList.appendChild(treeElement);
                    PermissionsPage.BindTreeView();
                };
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                };
                HuaLiangWindow.common.SendGetAjax(url, data, SFun, FFun, CFun);
            };
            /**
             * 绑定树形结构
             * @param listM 数据源
             */
            PermissionsPage.GetTreeElement = function (listM) {
                var itemUl = document.createElement("ul");
                for (var i = 0; i < listM.length; i++) {
                    var itemLi = document.createElement("li");
                    var InfoSpan = document.createElement("span");
                    itemLi.appendChild(InfoSpan);
                    if (!MTMa.IsNullOrUndefinedOrEmpty(listM[i].Ico)) {
                        var icoI = document.createElement("i");
                        MDMa.AddClass(icoI, listM[i].Ico);
                        InfoSpan.appendChild(icoI);
                    }
                    var NameText = document.createTextNode(listM[i].Name);
                    InfoSpan.appendChild(NameText);
                    var btnGroup = document.createElement("div");
                    itemLi.appendChild(btnGroup);
                    MDMa.AddClass(btnGroup, "btn-group btn-group-xs TreeBtnGroup");
                    if (i > 0) {
                        var BtnUp = document.createElement("button");
                        BtnUp.dataset.id = listM[i].ID;
                        BtnUp.dataset.targetid = listM[i - 1].ID;
                        MDMa.AddClass(BtnUp, "btn btn-primary glyphicon glyphicon-chevron-up");
                        MDMa.AddEvent(BtnUp, "click", PermissionsPage.BtnChangeRankEvent_Click);
                        btnGroup.appendChild(BtnUp);
                    }
                    if (i < listM.length - 1) {
                        var BtnDown = document.createElement("button");
                        BtnDown.dataset.id = listM[i].ID;
                        BtnDown.dataset.targetid = listM[i + 1].ID;
                        MDMa.AddClass(BtnDown, "btn btn-primary glyphicon glyphicon-chevron-down");
                        MDMa.AddEvent(BtnDown, "click", PermissionsPage.BtnChangeRankEvent_Click);
                        btnGroup.appendChild(BtnDown);
                    }
                    var BtnAdd = document.createElement("button");
                    BtnAdd.dataset.id = listM[i].ID;
                    BtnAdd.dataset.toggle = "modal";
                    BtnAdd.dataset.target = "#EditModal";
                    MDMa.AddClass(BtnAdd, "btn btn-success glyphicon glyphicon-plus");
                    MDMa.AddEvent(BtnAdd, "click", PermissionsPage.BtnAddEvent_Click);
                    btnGroup.appendChild(BtnAdd);
                    var BtnEdit = document.createElement("button");
                    BtnEdit.dataset.id = listM[i].ID;
                    MDMa.AddClass(BtnEdit, "btn btn-warning glyphicon glyphicon-pencil");
                    MDMa.AddEvent(BtnEdit, "click", PermissionsPage.BtnEditEvent_Click);
                    btnGroup.appendChild(BtnEdit);
                    var BtnRemove = document.createElement("button");
                    BtnRemove.dataset.id = listM[i].ID;
                    BtnRemove.dataset.toggle = "modal";
                    BtnRemove.dataset.target = "#DeleteModal";
                    MDMa.AddClass(BtnRemove, "btn btn-danger glyphicon glyphicon glyphicon-trash");
                    MDMa.AddEvent(BtnRemove, "click", PermissionsPage.BtnRemoveEvent_Click);
                    btnGroup.appendChild(BtnRemove);
                    if (!MTMa.IsNullOrUndefined(listM[i].Items) && listM[i].Items.length > 0) {
                        var itemUl_1 = PermissionsPage.GetTreeElement(listM[i].Items);
                        itemLi.appendChild(itemUl_1);
                    }
                    itemUl.appendChild(itemLi);
                }
                return itemUl;
            };
            /**
             * 绑定树形菜单
             */
            PermissionsPage.BindTreeView = function () {
                $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
                $('.tree li.parent_li > span').on('click', function (e) {
                    var children = $(this).parent('li.parent_li').find(' > ul > li');
                    if (children.is(":visible")) {
                        children.hide('fast');
                        $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
                    }
                    else {
                        children.show('fast');
                        $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
                    }
                    e.stopPropagation();
                });
            };
            /**
             * 新增按钮单击事件
             */
            PermissionsPage.BtnAddEvent_Click = function (e) {
                var btnElement = e.target;
                HuaLiangWindow.common.ClearModalForm("EditModal");
                var EditModalLabel = MDMa.$("EditModalLabel");
                EditModalLabel.textContent = "新增";
                PermissionsPage.PageData.ID = null;
                PermissionsPage.PageData.FK_ParentID = MTMa.IsNullOrUndefined(btnElement.dataset.id) ? null : btnElement.dataset.id;
                PermissionsPage.PageData.Type = MDMa.GetInputValue("SearchPermissionsType");
            };
            /**
             * 编辑按钮单击事件
             */
            PermissionsPage.BtnEditEvent_Click = function (e) {
                var btnElement = e.target;
                HuaLiangWindow.common.ClearModalForm("EditModal");
                var EditModalLabel = MDMa.$("EditModalLabel");
                EditModalLabel.textContent = "新增";
                PermissionsPage.PageData.ID = btnElement.dataset.id;
                PermissionsPage.PageData.FK_ParentID = null;
                PermissionsPage.PageData.Type = MDMa.GetInputValue("SearchPermissionsType");
                PermissionsPage.GetPermissionsInfoByID();
            };
            /**
             * 移除按钮单击事件
             */
            PermissionsPage.BtnRemoveEvent_Click = function (e) {
                var btnElement = e.target;
                PermissionsPage.PageData.ID = btnElement.dataset.id;
            };
            /**
             * 调换位序
             * @param e
             */
            PermissionsPage.BtnChangeRankEvent_Click = function (e) {
                var btnElement = e.target;
                btnElement.disabled = true;
                var url = "api/Permissions/ChangeRank";
                var data = {
                    ID: btnElement.dataset.id,
                    TargetID: btnElement.dataset.targetid
                };
                var SFun = function (resM, xhr, state) {
                    PermissionsPage.GetPermissionsInfoByType();
                };
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                    btnElement.disabled = false;
                };
                HuaLiangWindow.common.SendPostAjax(url, data, SFun, FFun, CFun);
            };
            /**
             * 根据ID获得权限信息
             * @param ID
             */
            PermissionsPage.GetPermissionsInfoByID = function () {
                var url = "api/Permissions/GetPermissionsInfoByID";
                var data = {
                    ID: PermissionsPage.PageData.ID
                };
                var SFun = function (resM, xhr, state) {
                    var perM = resM["Data"];
                    PermissionsPage.PageData.FK_ParentID = perM["FK_ParentID"];
                    PermissionsPage.PageData.Type = perM["Type"];
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
            PermissionsPage.prototype.BtnSaveEvent_Click = function (e) {
                HuaLiangWindow.common.ClearErrorMessage();
                var data = PermissionsInputModel.GetInputData();
                if (data != null) {
                    var BtnElement_1 = e.target;
                    BtnElement_1.textContent = "保存中......";
                    BtnElement_1.disabled = true;
                    var url = void 0;
                    if (MTMa.IsNullOrUndefinedOrEmpty(PermissionsPage.PageData.ID)) {
                        url = "api/Permissions/AddPermissions";
                    }
                    else {
                        url = "api/Permissions/EditPermissions";
                    }
                    var SFun = function (resM, xhr, state) {
                        PermissionsPage.GetPermissionsInfoByType();
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
            PermissionsPage.prototype.BtnDeleteEvent_Click = function (e) {
                var BtnElement = e.target;
                BtnElement.textContent = "删除中......";
                BtnElement.disabled = true;
                var url = "api/Permissions/DeletePermissions";
                var data = {
                    ID: PermissionsPage.PageData.ID
                };
                var SFun = function (resM, xhr, state) {
                    PermissionsPage.GetPermissionsInfoByType();
                    $('#EditModal').modal('toggle');
                };
                var FFun = function (resM, xhr, state) {
                };
                var CFun = function (resM, xhr, state) {
                    BtnElement.textContent = "删除";
                    BtnElement.disabled = false;
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                HuaLiangWindow.common.SendPostAjax(url, data, SFun, FFun, CFun);
            };
            return PermissionsPage;
        }());
        PermissionsPage.PageData = {
            ID: null,
            FK_ParentID: null,
            Type: null
        };
        /**
         * 权限模型
         */
        var PermissionsModel = (function () {
            function PermissionsModel() {
            }
            return PermissionsModel;
        }());
        /**
         * 权限输入模型
         */
        var PermissionsInputModel = (function () {
            function PermissionsInputModel() {
            }
            /**
             * 获得输入模型
             */
            PermissionsInputModel.GetInputData = function () {
                var data = null;
                var InputForm = document.forms["InputForm"];
                if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                    data = {
                        ID: PermissionsPage.PageData.ID,
                        Name: MDMa.GetInputValue("InputName"),
                        Type: PermissionsPage.PageData.Type,
                        FK_ParentID: PermissionsPage.PageData.FK_ParentID,
                        Code: MDMa.GetInputValue("InputCode"),
                        Ico: MDMa.GetInputValue("InputIco"),
                        Introduction: MDMa.GetInputValue("InputIntroduction"),
                        IfEnable: MDMa.$("InputIfEnable").checked,
                    };
                }
                return data;
            };
            return PermissionsInputModel;
        }());
        /*页面加载完成时触发*/
        MDMa.AddEvent(window, "load", function () {
            var pageM = new PermissionsPage();
        });
    })(Backstage = HuaLiangWindow.Backstage || (HuaLiangWindow.Backstage = {}));
})(HuaLiangWindow || (HuaLiangWindow = {}));
//# sourceMappingURL=Permissions.js.map