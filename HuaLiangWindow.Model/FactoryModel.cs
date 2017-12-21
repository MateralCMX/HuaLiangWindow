using MateralTools.MEnum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HuaLiangWindow.Model
{
    /// <summary>
    /// 工厂修改模型
    /// </summary>
    public sealed class EditFactoryInModel : T_Factory, IVerificationLoginModel
    {
        /// <summary>
        /// 登录用户唯一标识
        /// </summary>
        public Guid LoginUserID { get; set; }
        /// <summary>
        /// 登录用户Token
        /// </summary>
        public string LoginUserToken { get; set; }
    }
    /// <summary>
    /// 修改用户用户输入模型
    /// </summary>
    public class EditUserUserInModel : BaseQueryModel
    {
        /// <summary>
        /// 工厂唯一标识
        /// </summary>
        public Guid FactoryID { get; set; }
        /// <summary>
        /// 用户唯一标识
        /// </summary>
        public Guid UserID { get; set; }
    }
}
