using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CompanyAssignment.ViewModels
{
    public class EmployeeVM
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string DateOfHire { get; set; }
        public string Supervisor { get; set; } = "None";
        public List<Attribute> Attributes { get; set; }
    }
}