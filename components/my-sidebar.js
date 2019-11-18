// Import the LitElement base class and html helper function
import { LitElement, html } from 'https://cdn.pika.dev/lit-element/^2.2.1';

// Use relative paths for peer dependencies
import './my-element.js';
import './my-mood.js';

class MySidebar extends LitElement{


  firstUpdated(){
    // Toggle the side navigation
    console.log("MENU SIDEBAR",$("#sidebarToggle"))
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
      };
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
      if ($(window).width() < 768) {
        $('.sidebar .collapse').collapse('hide');
      };
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
      if ($(window).width() > 768) {
        var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
      }
    });
  }

sbtoggle(){

}



  render(){
    return html`

    <!-- Custom fonts for this template-->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <!-- Bootstrap core JavaScript-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.min.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">

    <!-- Sidebar -->
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled" id="accordionSidebar">

    <!-- Sidebar - Brand -->
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
    <div class="sidebar-brand-icon rotate-n-15">
    <i class="fas fa-laugh-wink"></i>
    </div>
    <div class="sidebar-brand-text mx-3">Solidash<sup>1</sup></div>
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider my-0">

    <!-- Nav Item - Dashboard -->
    <li class="nav-item active">
    <a class="nav-link" href="index.html">
    <i class="fas fa-fw fa-tachometer-alt"></i>
    <span>Solidash</span></a>
    </li>



    <!-- Nav Item - Charts -->


    <li class="nav-item">
    <a class="nav-link" href="bounties.html">
    <i class="fas fa-fw fa-chart-area"></i>
    <span>Bounties</span></a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="browser.html">
    <i class="fas fa-fw fa-chart-area"></i>
    <span>Browser</span></a>
    </li>

    <li class="nav-item">
    <a class="nav-link" href="context.html">
    <i class="fas fa-fw fa-chart-area"></i>
    <span>Context</span></a>
    </li>

    <li class="nav-item">
    <a class="nav-link" href="games.html">
    <i class="fas fa-fw fa-chart-area"></i>
    <span>Games</span></a>
    </li>

    <li class="nav-item">
    <a class="nav-link" href="developpement.html">
    <i class="fas fa-fw fa-chart-area"></i>
    <span>Developpement</span></a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="organization.html">
    <i class="fas fa-fw fa-chart-area"></i>
    <span>Organization</span></a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="sparql.html">
    <i class="fas fa-fw fa-chart-area"></i>
    <span>Sparql</span></a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="visualization.html">
    <i class="fas fa-fw fa-chart-area"></i>
    <span>Visualization</span></a>
    </li>

    <li class="nav-item">
    <a class="nav-link" href="charts.html">
    <i class="fas fa-fw fa-chart-area"></i>
    <span>Charts</span></a>
    </li>
    <!-- Nav Item - Tables -->
    <li class="nav-item">
    <a class="nav-link" href="tables.html">
    <i class="fas fa-fw fa-table"></i>
    <span>Tables</span></a>
    </li>

    <!-- Nav Item - Pages Collapse Menu -->
    <li class="nav-item">
    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true" aria-controls="collapsePages">
    <i class="fas fa-fw fa-folder"></i>
    <span>Pages</span>
    </a>
    <div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
    <div class="bg-white py-2 collapse-inner rounded">
    <h6 class="collapse-header">Login Screens:</h6>
    <a class="collapse-item" href="login.html">Login</a>
    <a class="collapse-item" href="register.html">Register</a>
    <a class="collapse-item" href="forgot-password.html">Forgot Password</a>
    <div class="collapse-divider"></div>
    <h6 class="collapse-header">Other Pages:</h6>
    <a class="collapse-item" href="404.html">404 Page</a>
    <a class="collapse-item" href="blank.html">Blank Page</a>
    </div>
    </div>
    </li>




    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block">

    <!-- Divider -->
    <hr class="sidebar-divider">

    <!-- Heading -->
    <div class="sidebar-heading">
    Interface
    </div>

    <!-- Nav Item - Pages Collapse Menu -->
    <li class="nav-item">
    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
    <i class="fas fa-fw fa-cog"></i>
    <span>Components</span>
    </a>
    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
    <div class="bg-white py-2 collapse-inner rounded">
    <h6 class="collapse-header">Custom Components:</h6>
    <a class="collapse-item" href="buttons.html">Buttons</a>
    <a class="collapse-item" href="cards.html">Cards</a>
    </div>
    </div>
    </li>

    <!-- Nav Item - Utilities Collapse Menu -->
    <li class="nav-item">
    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">
    <i class="fas fa-fw fa-wrench"></i>
    <span>Utilities</span>
    </a>
    <div id="collapseUtilities" class="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
    <div class="bg-white py-2 collapse-inner rounded">
    <h6 class="collapse-header">Custom Utilities:</h6>
    <a class="collapse-item" href="utilities-color.html">Colors</a>
    <a class="collapse-item" href="utilities-border.html">Borders</a>
    <a class="collapse-item" href="utilities-animation.html">Animations</a>
    <a class="collapse-item" href="utilities-other.html">Other</a>
    </div>
    </div>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider">

    <!-- Heading -->
    <div class="sidebar-heading">
    Addons
    </div>

    <!-- Sidebar Toggler (Sidebar) -->
    <div class="text-center d-none d-md-inline">
    <button class="rounded-circle border-0" id="sidebarToggle" @click=${this.sbtoggle} ></button>
    </div>

    </ul>
    <!-- End of Sidebar -->
    `;
  }
}
customElements.define('my-sidebar', MySidebar);
