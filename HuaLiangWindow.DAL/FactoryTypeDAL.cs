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
    /// 工厂类型数据操作类
    /// </summary>
    public sealed class FactoryTypeDAL : BaseDAL<T_FactoryType, V_FactoryType>
    {
        /// <summary>
        /// 根据条件获得工厂类型信息
        /// </summary>
        /// <param name="name">工厂类型名</param>
        /// <param name="ifEnable">启用标识</param>
        /// <param name="pageM">分页对象</param>
        /// <returns>工厂类型信息</returns>
        public List<V_FactoryType> GetFactoryTypeInfoByWhere(string name,bool? ifEnable, MPagingModel pageM)
        {
            Expression<Func<V_FactoryType, bool>> expression = m => true;
            if (!string.IsNullOrEmpty(name))
            {
                expression = LinqManager.And(expression, m => m.Name.Contains(name));
            }
            if (ifEnable != null)
            {
                expression = LinqManager.And(expression, m => m.IfEnable == ifEnable.Value);
            }
            pageM.DataCount = _DB.V_FactoryType.Count(expression.Compile());
            List<V_FactoryType> listM = null;
            if (pageM.DataCount > 0)
            {
                listM = _DB.V_FactoryType.Where(expression.Compile()).Skip((pageM.PagingIndex - 1) * pageM.PagingSize).Take(pageM.PagingSize).OrderBy(m => m.CreateTime).ToList();
            }
            return listM;
        }
        /// <summary>
        /// 根据启用状态获得工厂类型信息
        /// </summary>
        /// <param name="ifEnable">启用标识</param>
        /// <returns>工厂类型信息</returns>
        public List<V_FactoryType> GetFactoryTypeInfoByEnable(bool ifEnable)
        {
            List<V_FactoryType> listM = (from m in _DB.V_FactoryType
                                         where m.IfEnable == ifEnable
                                         orderby m.CreateTime
                                         select m).ToList();
            return listM;
        }
    }
}
