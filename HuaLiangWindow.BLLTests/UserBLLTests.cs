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
    public class UserBLLTests
    {
        private readonly UserBLL _userBLL = new UserBLL();
        [TestMethod()]
        public void LoginTest()
        {
            LoginOutModel resM = _userBLL.Login("Admin", "123456");
            if (resM == null)
            {
                Assert.Fail();
            }
        }

        [TestMethod()]
        public void AddTest()
        {
            T_User userM = new T_User
            {
                Email = "cloomcmx1554@hotmail.com",
                HeadPortrait = "",
                IfEnable = true,
                Mobile = "15808714100",
                NickName = "管理员",
                Sex = 0,
                TrueName = "管理员",
                UserName = "Admin"
            };
            _userBLL.Add(userM);
        }

        [TestMethod()]
        public void GetPermissionsInfoByUserIDTest()
        {
            PermissionsGroupModel resM = _userBLL.GetMenuPermissionsInfoByUserID(Guid.Parse("45C2B55C-C130-45B4-8975-A7C2BA883A29"));
        }
    }
}