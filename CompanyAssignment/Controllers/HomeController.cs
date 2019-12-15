using CompanyAssignment.ViewModels;
using Microsoft.Owin.Diagnostics.Views;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CompanyAssignment.Controllers
{
    public class HomeController : Controller
    {
        private CompanyEntities _context;

        public HomeController()
        {
            _context = new CompanyEntities();
        }

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetEmployees()
        {
            var employees = _context.Employees.ToList();

            var result = new List<EmployeeVM>();

            foreach (var employee in employees)
            {
                EmployeeVM VM = new EmployeeVM { Id = employee.EMP_ID, Name = employee.EMP_Name, DateOfHire = employee.EMP_DateOfHire.ToString() };

                if (employee.EMP_Supervisor != null)
                {
                    VM.Supervisor = _context.Employees.FirstOrDefault(x => x.EMP_ID == employee.EMP_Supervisor).EMP_Name;
                }

                result.Add(VM);
            }
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEmployeeAttributes(string Id)
        {
            
            var result = new List<AttributeVM>();
 
            var attributes = _context.Employees.FirstOrDefault(x => x.EMP_ID.ToString() == Id).Attributes.ToList();

            if (attributes != null)
            {

                foreach (var attr in attributes)
                {
                    result.Add(new AttributeVM { Id = attr.ATTR_ID, Name = attr.ATTR_Name, Value = attr.ATTR_Value });
                }
            }
            else
            {
                result.Add(new AttributeVM { Name = "None", Value = "None" });
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddEmployee(string Name, DateTime DateOfHire, string Supervisor)
        {
            Employee emp = new Employee { EMP_ID = Guid.NewGuid(), EMP_Name = Name, EMP_DateOfHire = DateOfHire };

            if (Supervisor.ToLower() != "none")
            {
                emp.EMP_Supervisor = Guid.Parse(Supervisor);
            }
            else
            {
                emp.EMP_Supervisor = null;
            }

            _context.Employees.Add(emp);
            _context.SaveChanges();

            return Json(JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetbyID(string Id)
        {
            Employee selectedEmployee = _context.Employees.FirstOrDefault(x => x.EMP_ID.ToString() == Id);
            EmployeeVM VM = new EmployeeVM { Id = selectedEmployee.EMP_ID, Name = selectedEmployee.EMP_Name };

            VM.DateOfHire = selectedEmployee.EMP_DateOfHire.ToShortDateString().Replace('/', '-');

            if (selectedEmployee.EMP_Supervisor != null)
            {
                VM.Supervisor = _context.Employees.FirstOrDefault(x => x.EMP_ID == selectedEmployee.EMP_Supervisor).EMP_Name;
            }

            return Json(VM, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateEmployee(string Id, string Name, DateTime DateOfHire, string Supervisor)
        {
            Employee employeeToUpdate = _context.Employees.FirstOrDefault(x => x.EMP_ID.ToString() == Id);

            if (employeeToUpdate != null)
            {
                employeeToUpdate.EMP_Name = Name;
                employeeToUpdate.EMP_DateOfHire = DateOfHire;

                if (Supervisor.ToLower() != "none")
                {
                    employeeToUpdate.EMP_Supervisor = Guid.Parse(Supervisor);
                }
                else
                {
                    employeeToUpdate.EMP_Supervisor = null;
                }
                _context.SaveChanges();
            }
            return Json(JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteEmployee(string Id)
        {
            Employee employeeToDelete = _context.Employees.FirstOrDefault(x => x.EMP_ID.ToString() == Id);

            var affectedEmployees = _context.Employees.Where(x => x.EMP_Supervisor == employeeToDelete.EMP_ID).ToList();

            if (affectedEmployees != null)
            {
                foreach (var employee in affectedEmployees)
                {
                    employee.EMP_Supervisor = null;
                }
            }

            var affectedAttributes = employeeToDelete.Attributes.Where(x=> x.Employees.Count == 1).ToList();

            if (affectedAttributes != null)
            {
                foreach (var attribute in affectedAttributes)
                {
                    var attributeToDelete = _context.Attributes.FirstOrDefault(x => x.ATTR_ID == attribute.ATTR_ID);
                    _context.Attributes.Remove(attributeToDelete);
                    _context.SaveChanges();
                }
            }

            _context.Employees.Remove(employeeToDelete);
            _context.SaveChanges();

            return Json(JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddAttribute(string Name, string Value, List<string> AffectedEmployees)
        {
            Attribute AttributeToAdd = new Attribute { ATTR_ID = Guid.NewGuid(), ATTR_Name = Name, ATTR_Value = Value };

            foreach (var empId in AffectedEmployees)
            {
                Employee AffectedEmployee = _context.Employees.FirstOrDefault(x => x.EMP_ID.ToString() == empId);
                AttributeToAdd.Employees.Add(AffectedEmployee);
            }

            _context.Attributes.Add(AttributeToAdd);
            _context.SaveChanges();

            return Json(JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAttributeById(string Id)
        {
            Attribute SelectedAttribute = _context.Attributes.FirstOrDefault(x => x.ATTR_ID.ToString() == Id);
            AttributeVM VM = new AttributeVM { Id = SelectedAttribute.ATTR_ID, Name = SelectedAttribute.ATTR_Name, Value = SelectedAttribute.ATTR_Value };

            foreach (var emp in SelectedAttribute.Employees)
            {
                VM.Employees.Add(new EmployeeVM { Id = emp.EMP_ID, Name = emp.EMP_Name });
            }

            return Json(VM, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateAttribute(string Id, string Name, string Value, List<string> AffectedEmployees)
        {
            Attribute AttributeToUpdate = _context.Attributes.FirstOrDefault(x => x.ATTR_ID.ToString() == Id);

            AttributeToUpdate.ATTR_Name = Name;
            AttributeToUpdate.ATTR_Value = Value;
            AttributeToUpdate.Employees.Clear();

            foreach (var empId in AffectedEmployees)
            {
                var temp = _context.Employees.FirstOrDefault(x => x.EMP_ID.ToString() == empId);
                AttributeToUpdate.Employees.Add(temp);
            }
            _context.SaveChanges();

            return Json(JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteAttribute(string Id)
        {
            Attribute AttributeToDelete = _context.Attributes.FirstOrDefault(x => x.ATTR_ID.ToString() == Id);

            foreach (var emp in AttributeToDelete.Employees)
            {
                emp.Attributes.Remove(AttributeToDelete);
            }

            _context.Attributes.Remove(AttributeToDelete);
            _context.SaveChanges();

            return Json(JsonRequestBehavior.AllowGet);
        }
    }
}