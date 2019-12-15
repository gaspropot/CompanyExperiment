using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CompanyAssignment.ViewModels
{
    public class AttributeVM
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public List<EmployeeVM> Employees { get; set; }

        public AttributeVM()
        {
            Employees = new List<EmployeeVM>();
        }
    }
}