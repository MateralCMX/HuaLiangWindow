using Microsoft.VisualStudio.TestTools.UnitTesting;
using HuaLiangWindow.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HuaLiangWindow.Model;

namespace HuaLiangWindow.BLL.Tests
{
    [TestClass()]
    public class PermissionsBLLTests
    {
        private readonly PermissionsBLL _permissionsBLL = new PermissionsBLL();
        [TestMethod()]
        public void GetPermissionsInfoByTypeTest()
        {
            List<PermissionsModel> listM = _permissionsBLL.GetPermissionsInfoByType(PermissionsTypesEnum.Menu);
        }

        [TestMethod()]
        public void GetEnablePermissionsInfoByUserGroupIDTest()
        {
            Guid userGroupID = Guid.Parse("80DBC377-3C41-4E11-A92C-14D697FFCA93");
            List<PermissionsGroupModel> listM = _permissionsBLL.GetEnablePermissionsInfoByUserGroupID(userGroupID);
        }
    }
}