﻿using App.DAL.Contexts;
using App.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.DAL.Repositories
{
    public class SettingBeforeRepository : GenericRepository<TblSettingBefore>, ISettingBeforeRepository
    {
        public SettingBeforeRepository(PJDesignContext context) : base(context)
        {
        }
    }
}
