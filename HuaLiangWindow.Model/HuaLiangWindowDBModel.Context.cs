﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class HuaLiangWindowDBEntities : DbContext
    {
        public HuaLiangWindowDBEntities()
            : base("name=HuaLiangWindowDBEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<sysdiagrams> sysdiagrams { get; set; }
        public virtual DbSet<T_ApplicationLog> T_ApplicationLog { get; set; }
        public virtual DbSet<T_Permissions> T_Permissions { get; set; }
        public virtual DbSet<T_Token> T_Token { get; set; }
        public virtual DbSet<T_User> T_User { get; set; }
        public virtual DbSet<T_UserGroup> T_UserGroup { get; set; }
        public virtual DbSet<V_Permissions> V_Permissions { get; set; }
        public virtual DbSet<V_User> V_User { get; set; }
        public virtual DbSet<V_UserGroup> V_UserGroup { get; set; }
        public virtual DbSet<T_FactoryType> T_FactoryType { get; set; }
        public virtual DbSet<V_FactoryType> V_FactoryType { get; set; }
        public virtual DbSet<T_Factory> T_Factory { get; set; }
        public virtual DbSet<V_Factory> V_Factory { get; set; }
    }
}
