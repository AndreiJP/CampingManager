import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  {
    path: "about",
    loadComponent: () =>
      import("../explore/about-page/about-page.component").then(
        (m) => m.AboutPageComponent,
      ),
  },
  {
    path: "activities",
    loadComponent: () =>
      import("../explore/activities-page/activities-page.component").then(
        (m) => m.ActivitiesPageComponent,
      ),
  },
  {
    path: "gallery",
    loadComponent: () =>
      import("../explore/gallery-page/gallery-page.component").then(
        (m) => m.GalleryPageComponent,
      ),
  },
  {
    path: "rules",
    loadComponent: () =>
      import("../explore/rules-page/rules-page.component").then(
        (m) => m.RulesPageComponent,
      ),
  },
  {
    path: "contact",
    loadComponent: () =>
      import("../explore/contact-page/contact-page.component").then(
        (m) => m.ContactPageComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
