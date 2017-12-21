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
    /// 工厂API接口
    /// </summary>
    [RoutePrefix("api/Factory")]
    public class FactoryController : ApiBaseController<FactoryBLL>
    {
        /// <summary>
        /// 根据类型获得工厂信息
        /// </summary>
        /// <param name="Name">名称</param>
        /// <param name="Code">代码</param>
        /// <param name="IfEnable">启用标识</param>
        /// <param name="PageIndex">当前页数</param>
        /// <param name="PageSize">每页显示数量</param>
        /// <returns>工厂信息</returns>
        [HttpGet]
        [Route("GetFactoryInfoByWhere")]
        public MResultModel GetFactoryInfoByWhere(string Name, bool? IfEnable, int PageIndex, int PageSize)
        {
            MPagingModel pageM = new MPagingModel(PageIndex, PageSize);
            List<V_Factory> listM = _bll.GetFactoryInfoByWhere(Name, IfEnable, pageM);
            return MResultPagingModel<List<V_Factory>>.GetSuccessResultM(listM, pageM, "查询成功");
        }
        /// <summary>
        /// 根据唯一标识获得工厂信息
        /// </summary>
        /// <param name="ID">唯一标识</param>
        /// <returns>工厂信息</returns>
        [HttpGet]
        [Route("GetFactoryInfoByID")]
        public MResultModel GetFactoryInfoByID(Guid ID)
        {
            V_Factory resM = _bll.GetDBModelViewInfoByID(ID);
            return MResultModel<V_Factory>.GetSuccessResultM(resM, "查询成功");
        }
        /// <summary>
        /// 根据工厂ID获得工厂绑定账户列表
        /// </summary>
        /// <param name="ID">唯一标识</param>
        /// <returns>工厂绑定账户信息</returns>
        [HttpGet]
        [Route("GetUsrViewInfoByFactoryID")]
        public MResultModel GetUsrViewInfoByFactoryID(Guid ID)
        {
            try
            {
                List<V_User> resM = _bll.GetUsrViewInfoByFactoryID(ID);
                return MResultModel<List<V_User>>.GetSuccessResultM(resM, "查询成功");
            }
            catch (ArgumentException ex)
            {
                return MResultModel.GetFailResultM(ex.Message);
            }
        }
        /// <summary>
        /// 添加工厂
        /// </summary>
        /// <param name="model">操作对象</param>
        /// <returns>操作结果</returns>
        [HttpPost]
        [Route("AddFactory")]
        [PermissionsCode(ApplicationManager.Permissions_FactoryOperation)]
        public MResultModel AddFactory(EditFactoryInModel model)
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
        /// 修改工厂
        /// </summary>
        /// <param name="model">操作对象</param>
        /// <returns>操作结果</returns>
        [HttpPost]
        [Route("EditFactory")]
        [PermissionsCode(ApplicationManager.Permissions_FactoryOperation)]
        public MResultModel EditFactory(EditFactoryInModel model)
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
        /// 删除工厂
        /// </summary>
        /// <param name="model">操作对象</param>
        /// <returns>操作结果</returns>
        [HttpPost]
        [Route("DeleteFactory")]
        [PermissionsCode(ApplicationManager.Permissions_FactoryOperation)]
        public MResultModel DeleteFactory(DeleteInModel model)
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
        /// <summary>
        /// 添加一个用户
        /// </summary>
        /// <param name="model">修改用户模型</param>
        /// <returns>修改结果</returns>
        [HttpPost]
        [Route("AddUser")]
        [PermissionsCode(ApplicationManager.Permissions_FactoryOperation)]
        public MResultModel AddUser(EditUserUserInModel model)
        {
            try
            {
                _bll.AddUser(model.FactoryID, model.UserID);
                return MResultModel.GetSuccessResultM("添加成功");
            }
            catch (ArgumentException ex)
            {
                return MResultModel.GetFailResultM(ex.Message);
            }
            catch (ApplicationException ex)
            {
                return MResultModel.GetFailResultM(ex.Message);
            }
        }
        /// <summary>
        /// 移除一个用户
        /// </summary>
        /// <param name="model">修改用户模型</param>
        /// <returns>修改结果</returns>
        [HttpPost]
        [Route("RemoveUser")]
        [PermissionsCode(ApplicationManager.Permissions_FactoryOperation)]
        public MResultModel RemoveUser(EditUserUserInModel model)
        {
            try
            {
                _bll.RemoveUser(model.FactoryID, model.UserID);
                return MResultModel.GetSuccessResultM("移除成功");
            }
            catch (ArgumentException ex)
            {
                return MResultModel.GetFailResultM(ex.Message);
            }
            catch (ApplicationException ex)
            {
                return MResultModel.GetFailResultM(ex.Message);
            }
        }
    }
}
