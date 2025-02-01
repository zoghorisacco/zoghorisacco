(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Header fixed top on scroll
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop
    let nextElement = selectHeader.nextElementSibling
    const headerFixed = () => {
      if ((headerOffset - window.scrollY) <= 0) {
        selectHeader.classList.add('fixed-top')
        nextElement.classList.add('scrolled-offset')
      } else {
        selectHeader.classList.remove('fixed-top')
        nextElement.classList.remove('scrolled-offset')
      }
    }
    window.addEventListener('load', headerFixed)
    onscroll(document, headerFixed)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /*** Scrool with ofset on links with a class name .scrollto*/
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /*** Scroll with ofset on page load with hash links in the url*/
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });


  /**var currentTab = 0;
  showTab(currentTab);
  
  function showTab(n) {
      var x = document.getElementsByClassName("tab");
      x[n].style.display = "block";
      if (n == 0) {
          document.getElementById("prevBtn").style.display = "none";
      } else {
          document.getElementById("prevBtn").style.display = "inline";
      }
      if (n == (x.length - 1)) {
          document.getElementById("nextBtn").innerHTML = "Submit";
      } else {
          document.getElementById("nextBtn").innerHTML = "Next";
      }
      fixStepIndicator(n);
  }
  
  function nextPrev(n) {
      var x = document.getElementsByClassName("tab");
      if (n == 1 && !validateForm()) return false;
      x[currentTab].style.display = "none";
      currentTab = currentTab + n;
      if (currentTab >= x.length) {
          document.getElementById("regForm").submit();
          return false;
      }
      showTab(currentTab);
  }
  
  function validateForm() {
      var x, y, i, valid = true;
      x = document.getElementsByClassName("tab");
      y = x[currentTab].getElementsByTagName("input");
      for (i = 0; i < y.length; i++) {
          if (y[i].value == "") {
              y[i].className += " invalid";
              valid = false;
          }
      }
      if (valid) {
          document.getElementsByClassName("step")[currentTab].className += " finish";
      }
      return valid;
  }
  
  function fixStepIndicator(n) {
      var i, x = document.getElementsByClassName("step");
      for (i = 0; i < x.length; i++) {
          x[i].className = x[i].className.replace(" active", "");
      }
      x[n].className += " active";
  }
  


/**AUTOSCROLL TESTIMONIAL */
const testimonials = document.querySelector('.testimonial-container');
let scrollAmount = 0;

function autoScroll() {
    scrollAmount += testimonials.clientWidth;
    if (scrollAmount >= testimonials.scrollWidth) {
        scrollAmount = 0;
    }
    testimonials.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

setInterval(autoScroll, 20000);




function openTab(tabName) {
  var i, x;
  x = document.getElementsByClassName("containerTab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}



/*----Counter Up----*/
  $(document).ready(function()  {
    $('.counter-add').each(function ()
    {
      $(this).prop('Counter', 0).animate(
      {
        Counter: $(this).text()
      },
      {
        duration: 4000,
        easing: 'swing',
        step: function (now) {
          $(this).text(Math.ceil(now));
        }
      });
    });
  });

  /**carousel hero*/
  


  /*** Clients Slider*/
  new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120
      }
    }
  });

  /*** Porfolio isotope and filter*/
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /*** Portfolio details slider*/
 new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });
})()

document.getElementById('calculateBtn').addEventListener('click', function() {
  // Get form inputs
  const loanAmount = parseFloat(document.getElementById('loanAmount').value);
  const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12; // Monthly rate
  const loanTerm = parseFloat(document.getElementById('loanTerm').value) * 12; // Convert to months

  if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm) || loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      alert("Please enter valid numbers.");
      return;
  }

  // Calculate monthly payment
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);

  // Generate amortization schedule
  const schedule = generateAmortizationSchedule(loanAmount, interestRate, loanTerm, monthlyPayment);

  // Update UI
  document.getElementById('monthlyPayment').value = monthlyPayment.toFixed(2);
  document.getElementById('totalInterest').value = (schedule.reduce((acc, entry) => acc + entry.interest, 0)).toFixed(2);

  // Populate the amortization schedule table
  const tableBody = document.getElementById('scheduleBody');
  tableBody.innerHTML = ''; // Clear previous entries

  schedule.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${entry.month}</td>
          <td>$${entry.beginningBalance.toFixed(2)}</td>
          <td>$${entry.interest.toFixed(2)}</td>
          <td>$${entry.principal.toFixed(2)}</td>
          <td>$${entry.endingBalance.toFixed(2)}</td>
      `;
      tableBody.appendChild(row);
  });
});

function calculateMonthlyPayment(principal, monthlyRate, months) {
  return (monthlyRate * principal) / (1 - Math.pow(1 + monthlyRate, -months));
}

function generateAmortizationSchedule(principal, monthlyRate, months, monthlyPayment) {
  let balance = principal;
  let schedule = [];

  for (let month = 1; month <= months; month++) {
      let interest = balance * monthlyRate;
      let principalPayment = monthlyPayment - interest;
      balance -= principalPayment;

      schedule.push({
          month: month,
          beginningBalance: balance + principalPayment,
          interest: interest,
          principal: principalPayment,
          endingBalance: balance
      });

      // Handle rounding errors that might make balance negative or too small
      if (balance < 0.01) {
          balance = 0;
          break;
      }
  }
  return schedule;
}