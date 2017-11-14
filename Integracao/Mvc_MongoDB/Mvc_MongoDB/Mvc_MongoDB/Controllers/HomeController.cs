using System.Web.Mvc;
using Mvc_MongoDB.Models;
using MongoDB.Bson;
using MongoDB.Driver.Builders;

namespace Mvc_MongoDB.Controllers
{
    public class HomeController : Controller
    {
        private readonly erpcloud Context = new erpcloud();

        public ActionResult Index()
        {
            var layouts = Context.Layout.FindAll().SetSortOrder(SortBy<layouts>.Ascending(r => r.layoutID));
            return View(layouts);
        }

        public ActionResult Create()
        {
            return View();

        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Create(layouts _lay)
        {
            if (ModelState.IsValid)
            {
                Context.Layout.Insert(_lay);
                return RedirectToAction("Index");
            }
            return View();
        }

        public ActionResult Edit(string Id)
        {
            var pais = Context.Layout.FindOneById(new ObjectId(Id));
            return View(pais);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Edit(layouts _pais)
        {
            if (ModelState.IsValid)
            {
                Context.Layout.Save(_pais);
                return RedirectToAction("Index");
            }
            return View();
        }

        [HttpGet]
        public ActionResult Delete(string Id)
        {
            var del = Context.Layout.FindOneById(new ObjectId(Id));
            return View(del);
        }

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(string Id)
        {
            var del = Context.Layout.Remove(Query.EQ("_id", new ObjectId(Id)));
            return RedirectToAction("Index");
        }
    }
}