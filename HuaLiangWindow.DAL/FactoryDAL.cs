using HuaLiangWindow.Model;
using MateralTools.MLinq;
using MateralTools.MResult;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HuaLiangWindow.DAL
{
    /// <summary>
    /// 工厂数据操作类
    /// </summary>
    public sealed class FactoryDAL : BaseDAL<T_Factory, V_Factory>
    {
        /// <summary>
        /// 根据条件获得工厂信息
        /// </summary>
        /// <param name="name">工厂名</param>
        /// <param name="ifEnable">启用标识</param>
        /// <param name="pageM">分页对象</param>
        /// <returns>工厂信息</returns>
        public List<V_Factory> GetFactoryInfoByWhere(string name,bool? ifEnable, MPagingModel pageM)
        {
            Expression<Func<V_Factory, bool>> expression = m => true;
            if (!string.IsNullOrEmpty(name))
            {
                expression = LinqManager.And(expression, m => m.Name.Contains(name));
            }
            if (ifEnable != null)
            {
                expression = LinqManager.And(expression, m => m.IfEnable == ifEnable.Value);
            }
            pageM.DataCount = _DB.V_Factory.Count(expression.Compile());
            List<V_Factory> listM = null;
            if (pageM.DataCount > 0)
            {
                listM = _DB.V_Factory.Where(expression.Compile()).Skip((pageM.PagingIndex - 1) * pageM.PagingSize).Take(pageM.PagingSize).OrderBy(m => m.CreateTime).ToList();
            }
            return listM;
        }
        /// <summary>
        /// 根据唯一标识获得用户信息
        /// </summary>
        /// <param name="id">唯一标识</param>
        /// <returns>用户信息</returns>
        public T_User GetUserInfoByID(Guid id)
        {
            return _DB.T_User.Where(m => m.ID == id).FirstOrDefault();
        }
    }
}
