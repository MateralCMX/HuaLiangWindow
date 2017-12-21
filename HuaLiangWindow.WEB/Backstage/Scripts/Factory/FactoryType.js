/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
var HuaLiangWindow;
(function (HuaLiangWindow) {
    var Backstage;
    (function (Backstage) {
        /**
         * 工厂类型页面
         */
        var FactoryTypePage = (function () {
            /**
             * 构造方法
             */
            function FactoryTypePage() {
                if (HuaLiangWindow.common.IsLogin(true)) {
                    FactoryTypePage.GetList();
                    this.BindEvent();
                }
            }
            /**
             * 绑定事件
             */
            FactoryTypePage.prototype.BindEvent = function () {
                MDMa.AddEvent("BtnSearch", "click", this.BtnSearchEvent_Click);
                MDMa.AddEvent("BtnAdd", "click", FactoryTypePage.BtnAddEvent_Click);
                MDMa.AddEvent("BtnSave", "click", this.BtnSaveEvent_Click);
                MDMa.AddEvent("BtnDelete", "click", this.BtnDeleteEvent_Click);
                MDMa.AddEvent("InputName", "invalid", function (e) {
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
            };
            /**
             * 获得列表
             */
            FactoryTypePage.GetList = function () {
                if (HuaLiangWindow.common.PagingM.PageModel.PagingIndex <= HuaLiangWindow.common.PagingM.PageModel.PagingCount) {
                    var url = "api/FactoryType/GetFactoryTypeInfoByWhere";
                    var data = FactoryTypeSearchModel.GetInputData();
                    var SFun = function (resM, xhr, state) {
                        FactoryTypePage.BindListInfo(resM["Data"]);
                        HuaLiangWindow.common.BindPageInfo(resM["PagingInfo"], FactoryTypePage.GetList);
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
            FactoryTypePage.BindListInfo = function (listM) {
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
                        var Introduction = document.createElement("td");
                        Introduction.textContent = listM[i]["Introduction"];
                        Item.appendChild(Introduction);
                        var IfEnable = document.createElement("td");
                        IfEnable.textContent = listM[i]["IfEnable"] ? "启用" : "禁用";
                        Item.appendChild(IfEnable);
                        var Operation = document.createElement("td");
                        var OperationBtnGroup = document.createElement("div");
                        MDMa.AddClass(OperationBtnGroup, "btn-group");
                        var EditBtn = document.createElement("button");
                        MDMa.AddClass(EditBtn, "btn btn-default");
                        EditBtn.setAttribute("type", "button");
                        EditBtn.textContent = "编辑";
                        MDMa.AddEvent(EditBtn, "click", FactoryTypePage.BtnEditEvent_Click);
                        EditBtn.dataset.id = listM[i]["ID"];
                        OperationBtnGroup.appendChild(EditBtn);
                        var RemoveBtn = document.createElement("button");
                        MDMa.AddClass(RemoveBtn, "btn btn-danger");
                        RemoveBtn.setAttribute("type", "button");
                        RemoveBtn.textContent = "删除";
                        RemoveBtn.dataset.toggle = "modal";
                        RemoveBtn.dataset.target = "#DeleteModal";
                        MDMa.AddEvent(RemoveBtn, "click", FactoryTypePage.BtnRemoveEvent_Click);
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
            FactoryTypePage.prototype.BtnSearchEvent_Click = function (e) {
                HuaLiangWindow.common.PagingM.PageModel.PagingIndex = 1;
                HuaLiangWindow.common.PagingM.PageModel.PagingCount = 99;
                FactoryTypePage.GetList();
            };
            /**
             * 新增按钮单击事件
             */
            FactoryTypePage.BtnAddEvent_Click = function (e) {
                var btnElement = e.target;
                HuaLiangWindow.common.ClearModalForm("EditModal");
                var EditModalLabel = MDMa.$("EditModalLabel");
                EditModalLabel.textContent = "新增";
                FactoryTypePage.PageData.ID = null;
            };
            /**
             * 编辑按钮单击事件
             */
            FactoryTypePage.BtnEditEvent_Click = function (e) {
                var btnElement = e.target;
                HuaLiangWindow.common.ClearModalForm("EditModal");
                var EditModalLabel = MDMa.$("EditModalLabel");
                EditModalLabel.textContent = "新增";
                FactoryTypePage.PageData.ID = btnElement.dataset.id;
                FactoryTypePage.GetFactoryTypeInfoByID();
            };
            /**
             * 移除按钮单击事件
             */
            FactoryTypePage.BtnRemoveEvent_Click = function (e) {
                var btnElement = e.target;
                FactoryTypePage.PageData.ID = btnElement.dataset.id;
            };
            /**
             * 根据ID获得工厂类型信息
             * @param ID
             */
            FactoryTypePage.GetFactoryTypeInfoByID = function () {
                var url = "api/FactoryType/GetFactoryTypeInfoByID";
                var data = {
                    ID: FactoryTypePage.PageData.ID
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
            FactoryTypePage.prototype.BtnSaveEvent_Click = function (e) {
                HuaLiangWindow.common.ClearErrorMessage();
                var data = FactoryTypeInputModel.GetInputData();
                if (data != null) {
                    var BtnElement_1 = e.target;
                    BtnElement_1.textContent = "保存中......";
                    BtnElement_1.disabled = true;
                    var url = void 0;
                    if (MTMa.IsNullOrUndefinedOrEmpty(FactoryTypePage.PageData.ID)) {
                        url = "api/FactoryType/AddFactoryType";
                    }
                    else {
                        url = "api/FactoryType/EditFactoryType";
                    }
                    var SFun = function (resM, xhr, state) {
                        FactoryTypePage.GetList();
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
            FactoryTypePage.prototype.BtnDeleteEvent_Click = function (e) {
                var BtnElement = e.target;
                BtnElement.textContent = "删除中......";
                BtnElement.disabled = true;
                var url = "api/FactoryType/DeleteFactoryType";
                var data = {
                    ID: FactoryTypePage.PageData.ID
                };
                var SFun = function (resM, xhr, state) {
                    $('#DeleteModal').modal('toggle');
                    FactoryTypePage.GetList();
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
            return FactoryTypePage;
        }());
        /*页面数据*/
        FactoryTypePage.PageData = {
            ID: null
        };
        /**
         * 工厂类型查询模型
         */
        var FactoryTypeSearchModel = (function () {
            function FactoryTypeSearchModel() {
            }
            /**
             * 获得输入模型
             */
            FactoryTypeSearchModel.GetInputData = function () {
                var data = {
                    Name: MDMa.GetInputValue("SearchName"),
                    IfEnable: MDMa.GetInputValue("SearchIfEnable"),
                    PageIndex: HuaLiangWindow.common.PagingM.PageModel.PagingIndex,
                    PageSize: HuaLiangWindow.common.PagingM.PageModel.PagingSize,
                };
                return data;
            };
            return FactoryTypeSearchModel;
        }());
        /**
         * 工厂类型输入模型
         */
        var FactoryTypeInputModel = (function () {
            function FactoryTypeInputModel() {
            }
            /**
             * 获得输入模型
             */
            FactoryTypeInputModel.GetInputData = function () {
                var data = null;
                var InputForm = document.forms["InputForm"];
                if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                    data = {
                        ID: FactoryTypePage.PageData.ID,
                        Name: MDMa.GetInputValue("InputName"),
                        Introduction: MDMa.GetInputValue("InputIntroduction"),
                        IfEnable: MDMa.$("InputIfEnable").checked,
                    };
                }
                return data;
            };
            return FactoryTypeInputModel;
        }());
        /*页面加载完成时触发*/
        MDMa.AddEvent(window, "load", function () {
            var pageM = new FactoryTypePage();
        });
    })(Backstage = HuaLiangWindow.Backstage || (HuaLiangWindow.Backstage = {}));
})(HuaLiangWindow || (HuaLiangWindow = {}));
//# sourceMappingURL=FactoryType.js.map