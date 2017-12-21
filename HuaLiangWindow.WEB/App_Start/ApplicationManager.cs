using HuaLiangWindow.BLL;
using MateralTools.MResult;
using System;
using System.Web;

namespace HuaLiangWindow.WEB
{
    /// <summary>
    /// 应用程序管理类
    /// </summary>
    public static class ApplicationManager
    {
        #region 权限信息
        /// <summary>
        /// 平台后台登录
        /// 可以登录后台系统
        /// </summary>
        public const string Permissions_AdminLogin = "AdminLogin";
        /// <summary>
        /// 用户信息操作
        /// 可以在后台增加用户的信息
        /// 可以对所有用户的信息进行修改
        /// 可以对所有用户的信息进行删除
        /// </summary>
        public const string Permissions_UserOperation = "UserOperation";
        /// <summary>
        /// 权限信息操作
        /// 可以在增加权限的信息
        /// 可以对权限的信息进行修改
        /// 可以对权限的信息进行删除
        /// </summary>
        public const string Permissions_PermissionsOperation = "PermissionsOperation";
        /// <summary>
        /// 用户组信息操作
        /// 可以对所有用户的用户组进行设置
        /// 可以对用户组信息进行权限设置
        /// 可以新增用户组信息
        /// 可以删除用户组信息
        /// </summary>
        public const string Permissions_UserGroupOperation = "UserGroupOperation";
        /// <summary>
        /// 商品信息操作
        /// 可以添加商品信息
        /// 可以修改商品信息
        /// 可以删除商品信息
        /// </summary>
        public const string Permissions_ProductOperation = "ProductOperation";
        /// <summary>
        /// 商品类型信息操作
        /// 可以添加商品类型信息
        /// 可以修改商品类型信息
        /// 可以删除商品类型信息
        /// </summary>
        public const string Permissions_ProductTypeOperation = "ProductTypeOperation";
        #endregion
        /// <summary>
        /// 保存上传文件地址
        /// </summary>
        public const string SAVEPATH = "UploadFiles\\";
        /// <summary>
        /// 保存临时文件地址
        /// </summary>
        public static string SAVETEMPPATH
        {
            get
            {
                return SAVEPATH + "Temp\\";
            }
        }
        /// <summary>
        /// 保存图片文件地址
        /// </summary>
        public static string SAVEIMAGEPATH
        {
            get
            {
                return SAVEPATH + "Images\\";
            }
        }
        /// <summary>
        /// 保存微信企业号图片文件地址
        /// </summary>
        public static string SAVEWECHATWORKIMAGEPATH
        {
            get
            {
                return SAVEPATH + "WeChatWorkImages\\";
            }
        }
        /// <summary>
        /// 富文本编辑器上传地址
        /// </summary>
        public static string SAVEKINDEDITORIMAGEPATH
        {
            get
            {
                return SAVEPATH + "KindEditorImages\\";
            }
        }
        /// <summary>
        /// 验证码SessionKey
        /// </summary>
        public const string VALIDATECODEKEY = "ValidateCodeValue";
        /// <summary>
        /// 手机验证码SessionKey
        /// </summary>
        public const string PHONECODEKEY = "PhoneCodeValue";
        /// <summary>
        /// 设置Session
        /// </summary>
        /// <param name="key">key</param>
        /// <param name="value">值</param>
        public static void SetSession(string key, object value)
        {
            HttpContext.Current.Session[key] = value;
        }
        /// <summary>
        /// 获得Session
        /// </summary>
        /// <param name="key">key</param>
        /// <returns>保存的值</returns>
        public static object GetSession(string key)
        {
            return HttpContext.Current.Session[key];
        }
        /// <summary>
        /// 获得Session
        /// </summary>
        /// <param name="key">key</param>
        /// <returns>保存的值</returns>
        public static T GetSession<T>(string key)
        {
            return (T)GetSession(key);
        }
    }
}
