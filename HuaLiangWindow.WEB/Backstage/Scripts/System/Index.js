/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
var HuaLiangWindow;
(function (HuaLiangWindow) {
    var Backstage;
    (function (Backstage) {
        /**
         * 首页
         */
        var IndexPage = (function () {
            /**
             * 构造方法
             */
            function IndexPage() {
                if (HuaLiangWindow.common.IsLogin(true)) {
                    this.BindAllSex();
                    this.GetMenuInfoByLoginUser();
                    this.BindEvent();
                }
            }
            /**
             * 绑定事件
             */
            IndexPage.prototype.BindEvent = function () {
                MDMa.AddEvent("BtnSave", "click", this.BtnSaveEvent_Click);
                MDMa.AddEvent("BtnSavePassword", "click", this.BtnSavePasswordEvent_Click);
                MDMa.AddEvent("BtnLogOut", "click", this.BtnLogOutEvent_Click);
                MDMa.AddEvent("InputNickName", "invalid", function (e) {
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputUserName", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    setting.Pattern = "只可使用英文和数字";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputMobile", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    setting.Pattern = "格式错误";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputEmail", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    setting.Pattern = "邮箱格式不正确";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputTrueName", "invalid", function (e) {
                    var element = e.target;
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    setting.Pattern = "请填写正确的中文真实姓名";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputOldPassword", "invalid", function (e) {
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputNewPassword1", "invalid", function (e) {
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputNewPassword2", "invalid", function (e) {
                    var setting = new HuaLiangWindow.InvalidOptionsModel();
                    setting.Required = "不能为空";
                    HuaLiangWindow.common.InputInvalidEvent_Invalid(e, setting);
                });
            };
            /**
             * 获得所有性别枚举信息
             */
            IndexPage.prototype.BindAllSex = function () {
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
                    IndexPage.BindLoginUserInfo();
                };
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                };
                HuaLiangWindow.common.SendGetAjax(url, data, SFun, FFun, CFun);
            };
            /**
             * 绑定登录用户信息
             */
            IndexPage.BindLoginUserInfo = function () {
                var loginUserInfo = HuaLiangWindow.common.GetLoginUserInfo();
                var url = "api/User/GetUserViewInfoByID";
                var data = {
                    ID: loginUserInfo.ID
                };
                var SFun = function (resM, xhr, state) {
                    var UserInfo = resM["Data"];
                    HuaLiangWindow.common.BindInputInfo(UserInfo);
                    var ShowName = MTMa.IsNullOrUndefinedOrEmpty(UserInfo["TrueName"]) ? UserInfo["NickName"] : UserInfo["TrueName"];
                    var LoginUserName = MDMa.$("LoginUserName");
                    LoginUserName.insertBefore(document.createTextNode(ShowName), LoginUserName.childNodes[0]);
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
            IndexPage.prototype.BtnSaveEvent_Click = function (e) {
                HuaLiangWindow.common.ClearErrorMessage();
                var data = IndexInputModel.GetInputData();
                if (data != null) {
                    var BtnElement_1 = e.target;
                    BtnElement_1.textContent = "保存中......";
                    BtnElement_1.disabled = true;
                    var url = "api/User/UpdateMyInfo";
                    var SFun = function (resM, xhr, state) {
                        $('#EditModal').modal('toggle');
                    };
                    var FFun = function (resM, xhr, state) {
                    };
                    var CFun = function (resM, xhr, state) {
                        BtnElement_1.textContent = "保存";
                        BtnElement_1.disabled = false;
                        HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                    };
                    HuaLiangWindow.common.SendPostAjax(url, data, SFun, FFun, CFun);
                }
            };
            /**
             * 退出登录按钮单击事件
             * @param e
             */
            IndexPage.prototype.BtnLogOutEvent_Click = function (e) {
                HuaLiangWindow.common.RemoveLoginUserInfo();
                HuaLiangWindow.common.GoToPage("Login");
            };
            /**
             * 保存密码按钮单击事件
             * @param e
             */
            IndexPage.prototype.BtnSavePasswordEvent_Click = function (e) {
                HuaLiangWindow.common.ClearErrorMessage();
                var data = EditPasswordModel.GetInputData();
                if (data != null) {
                    var BtnElement_2 = e.target;
                    BtnElement_2.textContent = "保存中......";
                    BtnElement_2.disabled = true;
                    var url = "api/User/EditMyPassword";
                    var SFun = function (resM, xhr, state) {
                        $('#EditPassowrdModal').modal('toggle');
                    };
                    var FFun = function (resM, xhr, state) {
                    };
                    var CFun = function (resM, xhr, state) {
                        BtnElement_2.textContent = "保存";
                        BtnElement_2.disabled = false;
                        HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                    };
                    HuaLiangWindow.common.SendPostAjax(url, data, SFun, FFun, CFun);
                }
            };
            /**
             * 根据登录获得菜单信息
             */
            IndexPage.prototype.GetMenuInfoByLoginUser = function () {
                var url = "api/User/GetMenuInfoByLoginUser";
                var data = {};
                var SFun = function (resM, xhr, state) {
                    var TopNav = MDMa.$("TopNav");
                    TopNav.innerHTML = "";
                    IndexPage.PageData.Permissions = resM["Data"]["Items"];
                    for (var i = 0; i < IndexPage.PageData.Permissions.length; i++) {
                        var li = document.createElement("li");
                        var a = document.createElement("a");
                        if (IndexPage.PageData.Permissions[i]["Ico"] != null) {
                            var ico = document.createElement("i");
                            MDMa.AddClass(ico, IndexPage.PageData.Permissions[i]["Ico"]);
                            a.appendChild(ico);
                        }
                        a.appendChild(document.createTextNode(IndexPage.PageData.Permissions[i].Name));
                        a.dataset.topid = "TopNav";
                        if (IndexPage.PageData.Permissions[i].Items == null) {
                            a.dataset.href = IndexPage.PageData.Permissions[i]["Code"];
                            MDMa.AddEvent(a, "click", function (e) {
                                IndexPage.OpenIFramePage(e);
                                MDMa.AddClass("MainPanel", "NoLeft");
                            });
                        }
                        else {
                            a.dataset.index = i.toString();
                            MDMa.AddEvent(a, "click", IndexPage.BindLeftMenu);
                        }
                        li.appendChild(a);
                        TopNav.appendChild(li);
                    }
                };
                var FFun = function (resM, xhr, state) {
                    HuaLiangWindow.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                };
                HuaLiangWindow.common.SendPostAjax(url, data, SFun, FFun, CFun);
            };
            ///**
            // * 根据用户ID获得权限信息
            // */
            //private GetMenuRightsThreeInfoByUserID() {
            //    let url: string = "api/User/GetMenuRightsThreeInfoByUserID";
            //    let data = {};
            //    let SFun = function (resM: Object) {
            //        //IndexPage.PageData.RightsM = resM["Data"];
            //        //let TopNav = MDMa.$("TopNav");
            //        //TopNav.innerHTML = "";
            //        //for (let i = 0; i < IndexPage.PageData.RightsM.length; i++) {
            //        //    let li = document.createElement("li");
            //        //    let a = document.createElement("a");
            //        //    if (IndexPage.PageData.RightsM[i]["Ico"] != null) {
            //        //        let ico = document.createElement("i");
            //        //        MDMa.AddClass(ico, IndexPage.PageData.RightsM[i]["Ico"]);
            //        //        a.appendChild(ico);
            //        //    }
            //        //    a.appendChild(document.createTextNode(IndexPage.PageData.RightsM[i].Name));
            //        //    a.dataset.topid = "TopNav";
            //        //    if (IndexPage.PageData.RightsM[i].Items == null) {
            //        //        a.dataset.href = IndexPage.PageData.RightsM[i]["Code"];
            //        //        MDMa.AddEvent(a, "click", function (e) {
            //        //            IndexPage.OpenIFramePage(e);
            //        //            MDMa.AddClass("MainPanel", "NoLeft");
            //        //        });
            //        //    }
            //        //    else {
            //        //        a.dataset.index = i.toString();
            //        //        MDMa.AddEvent(a, "click", IndexPage.BindLeftMenu);
            //        //    }
            //        //    li.appendChild(a);
            //        //    TopNav.appendChild(li);
            //        //}
            //    };
            //    let FFun = function (xhr: XMLHttpRequest, resM: Object) {
            //        common.ShowMessageBox("操作失败,您的权限不足", 3);
            //    };
            //    let CFun = function (resM: Object) {
            //    };
            //    common.SendAjax(url, data, SFun, EFun, CFun);
            //}
            /**
             * 打开左部页面
             * @param e
             */
            IndexPage.OpenIFramePage = function (e) {
                var btn = e.target;
                while (!btn.dataset.href) {
                    btn = btn.parentElement;
                }
                var href = btn.dataset.href;
                var MainFrame = document.getElementById("MainFrame");
                MainFrame.setAttribute("src", href);
                IndexPage.SetActive(btn);
            };
            /**
             * 设置选择样式
             * @param ActiveElement 要选择的元素
             */
            IndexPage.SetActive = function (ActiveElement) {
                var TopElement = MDMa.$(ActiveElement.dataset.topid);
                if (TopElement) {
                    var activeElement = TopElement.getElementsByClassName("active");
                    for (var i = activeElement.length - 1; i == activeElement.length || i >= 0; i--) {
                        MDMa.RemoveClass(activeElement[i], "active");
                    }
                }
                MDMa.AddClass(ActiveElement.parentElement, "active");
                while (MDMa.HasClass(ActiveElement.parentElement.parentElement, "collapse")) {
                    MDMa.AddClass(ActiveElement.parentElement.parentElement.parentElement, "active");
                    ActiveElement = ActiveElement.parentElement.parentElement.parentElement;
                }
            };
            /**
             * 绑定左部菜单
             * @param e
             */
            IndexPage.BindLeftMenu = function (e) {
                var btn = e.target;
                while (!btn.dataset.index) {
                    btn = btn.parentElement;
                }
                var index = btn.dataset.index;
                MDMa.RemoveClass("MainPanel", "NoLeft");
                var rightM = IndexPage.PageData.Permissions[index]["Items"];
                var mainNav = MDMa.$("main-nav");
                mainNav.innerHTML = "";
                for (var i = 0; i < rightM["length"]; i++) {
                    var li = IndexPage.GetLeftHrefBtn(rightM[i]);
                    mainNav.appendChild(li);
                }
                //let MainFrame = document.getElementById("MainFrame") as HTMLIFrameElement;
                //MainFrame.setAttribute("src", '/Home/Helper');
                IndexPage.SetActive(btn);
            };
            /**
             * 获得左部菜单单项
             * @param model
             */
            IndexPage.GetLeftHrefBtn = function (model) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                if (model["Ico"] != null) {
                    var ico = document.createElement("i");
                    MDMa.AddClass(ico, model["Ico"]);
                    a.appendChild(ico);
                }
                a.appendChild(document.createTextNode(model["Name"]));
                if (model["Items"] == null) {
                    a.dataset.href = model["Code"];
                    a.dataset.topid = "main-nav";
                    MDMa.AddEvent(a, "click", function (e) {
                        IndexPage.OpenIFramePage(e);
                    });
                    li.appendChild(a);
                }
                else {
                    var span = document.createElement("span");
                    MDMa.AddClass(span, "pull-right glyphicon glyphicon-chevron-down");
                    a.setAttribute("href", "#" + model["Code"]);
                    MDMa.AddClass(a, "nav-header collapsed");
                    a.dataset.toggle = "collapse";
                    var subUl = document.createElement("ul");
                    subUl.setAttribute("id", model["Code"]);
                    MDMa.AddClass(subUl, "nav nav-list collapse secondmenu");
                    for (var i = 0; i < model["Items"]["length"]; i++) {
                        var subli = IndexPage.GetLeftHrefBtn(model["Items"][i]);
                        subUl.appendChild(subli);
                    }
                    a.appendChild(span);
                    li.appendChild(a);
                    li.appendChild(subUl);
                }
                return li;
            };
            return IndexPage;
        }());
        IndexPage.PageData = {
            LoginUserID: "",
            Permissions: []
        };
        /**
         * 登录输入模型
         */
        var IndexInputModel = (function () {
            function IndexInputModel() {
            }
            /**
             * 获得输入模型
             */
            IndexInputModel.GetInputData = function () {
                var data = null;
                var InputForm = document.forms["InputForm"];
                if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                    var loginUserInfo = HuaLiangWindow.common.GetLoginUserInfo();
                    data = {
                        ID: loginUserInfo.ID,
                        NickName: MDMa.GetInputValue("InputNickName"),
                        UserName: MDMa.GetInputValue("InputUserName"),
                        Mobile: MDMa.GetInputValue("InputMobile"),
                        Email: MDMa.GetInputValue("InputEmail"),
                        TrueName: MDMa.GetInputValue("InputTrueName"),
                        Sex: MDMa.GetInputValue("InputSex"),
                    };
                }
                return data;
            };
            return IndexInputModel;
        }());
        /**
         * 修改密码模型
         */
        var EditPasswordModel = (function () {
            function EditPasswordModel() {
            }
            /**
             * 获得输入模型
             */
            EditPasswordModel.GetInputData = function () {
                var data = null;
                var InputForm = document.forms["PasswordInputForm"];
                if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                    var loginUserInfo = HuaLiangWindow.common.GetLoginUserInfo();
                    data = {
                        ID: loginUserInfo.ID,
                        OldPassword: MDMa.GetInputValue("InputOldPassword"),
                        NewPassword: MDMa.GetInputValue("InputNewPassword1"),
                    };
                    var NewPassword = MDMa.GetInputValue("InputNewPassword2");
                    if (data.NewPassword != NewPassword) {
                        data = null;
                        HuaLiangWindow.common.SetInputErrorMessage("InputNewPassword1", "两次输入的密码不一样");
                        HuaLiangWindow.common.SetInputErrorMessage("InputNewPassword2", "两次输入的密码不一样");
                    }
                }
                return data;
            };
            return EditPasswordModel;
        }());
        /*页面加载完成时触发*/
        MDMa.AddEvent(window, "load", function () {
            var pageM = new IndexPage();
        });
    })(Backstage = HuaLiangWindow.Backstage || (HuaLiangWindow.Backstage = {}));
})(HuaLiangWindow || (HuaLiangWindow = {}));
//# sourceMappingURL=Index.js.map