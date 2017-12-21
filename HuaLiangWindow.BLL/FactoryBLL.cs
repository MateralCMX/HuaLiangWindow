using HuaLiangWindow.DAL;
using HuaLiangWindow.Model;
using MateralTools.MEncryption;
using MateralTools.MResult;
using MateralTools.MVerify;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HuaLiangWindow.BLL
{
    /// <summary>
    /// 工厂业务类
    /// </summary>
    public sealed class FactoryBLL : BaseBLL<FactoryDAL, T_Factory, V_Factory>
    {
        #region 成员
        #endregion
        #region 公共方法
        /// <summary>
        /// 删除一个工厂对象
        /// </summary>
        /// <param name="ID">工厂ID</param>
        /// <exception cref="ArgumentException"></exception>
        public void Delete(Guid id)
        {
            T_Factory userM = _dal.GetDBModelInfoByID(id);
            if (userM != null)
            {
                userM.IfDelete = true;
                _dal.SaveChange();
            }
            else
            {
                throw new ArgumentException("工厂不存在。");
            }
        }
        /// <summary>
        /// 修改一个工厂对象
        /// </summary>
        /// <param name="model">工厂对象</param>
        /// <exception cref="ArgumentException"></exception>
        public void Update(T_Factory model)
        {
            T_Factory userM = _dal.GetDBModelInfoByID(model.ID);
            if (userM != null)
            {
                string msg = "";
                if (Verification(model, ref msg))
                {
                    userM.IfEnable = model.IfEnable;
                    userM.Name = model.Name;
                    _dal.SaveChange();
                }
                else
                {
                    throw new ArgumentException(msg);
                }
            }
            else
            {
                throw new ArgumentException("工厂不存在");
            }
        }
        /// <summary>
        /// 添加一个工厂对象
        /// </summary>
        /// <param name="model">工厂对象</param>
        /// <exception cref="ArgumentException"></exception>
        public void Add(T_Factory model)
        {
            DateTime dt = DateTime.Now;
            model.IfDelete = false;
            model.CreateTime = dt;
            string msg = "";
            if (Verification(model, ref msg))
            {
                _dal.Insert(model);
            }
            else
            {
                throw new ArgumentException(msg);
            }
        }
        /// <summary>
        /// 根据条件获得工厂信息
        /// </summary>
        /// <param name="name">名称</param>
        /// <param name="code">代码</param>
        /// <param name="ifEnable">启用标识</param>
        /// <param name="pageM">分页对象</param>
        /// <returns>工厂信息</returns>
        public List<V_Factory> GetFactoryInfoByWhere(string name, bool? ifEnable, MPagingModel pageM)
        {
            List<V_Factory> listM = _dal.GetFactoryInfoByWhere(name, ifEnable, pageM);
            return listM;
        }
        #endregion
        #region 私有方法
        /// <summary>
        /// 验证模型
        /// </summary>
        /// <param name="model">要验证的模型</param>
        /// <param name="msg">提示信息</param>
        /// <returns>验证结果</returns>
        protected override bool Verification(T_Factory model, ref string msg)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                msg += "工厂名称不能为空，";
            }
            return base.Verification(model, ref msg);
        }
        #endregion
    }
}
