//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace HuaLiangWindow.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class V_Factory
    {
        public System.Guid ID { get; set; }
        public string Name { get; set; }
        public System.Guid FK_FactoryType { get; set; }
        public string FactoryTypeName { get; set; }
        public string Remark { get; set; }
        public bool IfEnable { get; set; }
        public System.DateTime CreateTime { get; set; }
    }
}
