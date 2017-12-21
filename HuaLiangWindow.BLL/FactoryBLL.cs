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
        private readonly UserDAL _userDAL = new UserDAL();
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
                    userM.Remark = model.Remark;
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
        /// <summary>
        /// 根据工厂ID获得工厂绑定账户列表
        /// </summary>
        /// <param name="id">工厂ID</param>
        /// <returns>工厂绑定账户列表</returns>
        /// <exception cref="ArgumentException"></exception>
        public List<V_User> GetUsrViewInfoByFactoryID(Guid id)
        {
            T_Factory factoryM = _dal.GetDBModelInfoByID(id);
            if (factoryM != null)
            {
                Guid[] userIDs = (from m in factoryM.T_User
                                  select m.ID).ToArray();
                List<V_User> listM = _userDAL.GetUserViewInfoByIDs(userIDs);
                return listM;
            }
            else
            {
                throw new ArgumentException("该工厂不存在");
            }
        }
        /// <summary>
        /// 添加一个工厂组
        /// </summary>
        /// <param name="factoryID">工厂唯一标识</param>
        /// <param name="factoryGroupID">工厂组唯一标识</param>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="ApplicationException"></exception>
        public void AddUser(Guid factoryID, Guid factoryGroupID)
        {
            T_Factory factoryM = _dal.GetDBModelInfoByID(factoryID);
            if (factoryM != null)
            {
                T_User userM = _dal.GetUserInfoByID(factoryGroupID);
                if (userM != null)
                {
                    if (factoryM.T_User.Where(m => m.ID == factoryGroupID).FirstOrDefault() == null)
                    {
                        factoryM.T_User.Add(userM);
                        _dal.SaveChange();
                    }
                    else
                    {
                        throw new ApplicationException("该用户已经与该工厂绑定");
                    }
                }
                else
                {
                    throw new ArgumentException("与用户不存在");
                }
            }
            else
            {
                throw new ArgumentException("工厂不存在");
            }
        }
        /// <summary>
        /// 移除一个工厂组
        /// </summary>
        /// <param name="factoryID">工厂唯一标识</param>
        /// <param name="factoryGroupID">工厂组唯一标识</param>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="ApplicationException"></exception>
        public void RemoveUser(Guid factoryID, Guid factoryGroupID)
        {
            T_Factory factoryM = _dal.GetDBModelInfoByID(factoryID);
            if (factoryM != null)
            {
                T_User factoryGroupM = factoryM.T_User.Where(m => m.ID == factoryGroupID).FirstOrDefault();
                if (factoryGroupM != null)
                {
                    factoryM.T_User.Remove(factoryGroupM);
                    _dal.SaveChange();
                }
                else
                {
                    throw new ApplicationException("该用户不属于该工厂");
                }
            }
            else
            {
                throw new ArgumentException("工厂不存在");
            }
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
