using HuaLiangWindow.BLL;
using HuaLiangWindow.Model;
using MateralTools.MEnum;
using MateralTools.MResult;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace HuaLiangWindow.WEB.Controllers.API
{
    /// <summary>
    /// 工厂类型API接口
    /// </summary>
    [RoutePrefix("api/FactoryType")]
    public class FactoryTypeController : ApiBaseController<FactoryTypeBLL>
    {
        /// <summary>
        /// 根据类型获得工厂类型信息
        /// </summary>
        /// <param name="Name">名称</param>
        /// <param name="Code">代码</param>
        /// <param name="IfEnable">启用标识</param>
        /// <param name="PageIndex">当前页数</param>
        /// <param name="PageSize">每页显示数量</param>
        /// <returns>工厂类型信息</returns>
        [HttpGet]
        [Route("GetFactoryTypeInfoByWhere")]
        public MResultModel GetFactoryTypeInfoByWhere(string Name, bool? IfEnable, int PageIndex, int PageSize)
        {
            MPagingModel pageM = new MPagingModel(PageIndex, PageSize);
            List<V_FactoryType> listM = _bll.GetFactoryTypeInfoByWhere(Name, IfEnable, pageM);
            return MResultPagingModel<List<V_FactoryType>>.GetSuccessResultM(listM, pageM, "查询成功");
        }
        /// <summary>
        /// 根据唯一标识获得工厂类型信息
        /// </summary>
        /// <param name="ID">唯一标识</param>
        /// <returns>工厂类型信息</returns>
        [HttpGet]
        [Route("GetFactoryTypeInfoByID")]
        public MResultModel GetFactoryTypeInfoByID(Guid ID)
        {
            V_FactoryType resM = _bll.GetDBModelViewInfoByID(ID);
            return MResultModel<V_FactoryType>.GetSuccessResultM(resM, "查询成功");
        }
        /// <summary>
        /// 添加工厂类型
        /// </summary>
        /// <param name="model">操作对象</param>
        /// <returns>操作结果</returns>
        [HttpPost]
        [Route("AddFactoryType")]
        [PermissionsCode(ApplicationManager.Permissions_FactoryTypeOperation)]
        public MResultModel AddFactoryType(EditFactoryTypeInModel model)
        {
            try
            {
                _bll.Add(model);
                return MResultModel.GetSuccessResultM("添加成功");
            }
            catch(ArgumentException ex)
            {
                return MResultModel.GetFailResultM(ex.Message);
            }
        }
        /// <summary>
        /// 修改工厂类型
        /// </summary>
        /// <param name="model">操作对象</param>
        /// <returns>操作结果</returns>
        [HttpPost]
        [Route("EditFactoryType")]
        [PermissionsCode(ApplicationManager.Permissions_FactoryTypeOperation)]
        public MResultModel EditFactoryType(EditFactoryTypeInModel model)
        {
            try
            {
                _bll.Update(model);
                return MResultModel.GetSuccessResultM("修改成功");
            }
            catch (ArgumentException ex)
            {
                return MResultModel.GetFailResultM(ex.Message);
            }
        }
        /// <summary>
        /// 删除工厂类型
        /// </summary>
        /// <param name="model">操作对象</param>
        /// <returns>操作结果</returns>
        [HttpPost]
        [Route("DeleteFactoryType")]
        [PermissionsCode(ApplicationManager.Permissions_FactoryTypeOperation)]
        public MResultModel DeleteFactoryType(DeleteInModel model)
        {
            try
            {
                _bll.Delete(model.ID);
                return MResultModel.GetSuccessResultM("删除成功");
            }
            catch (ArgumentException ex)
            {
                return MResultModel.GetFailResultM(ex.Message);
            }
        }
    }
}
