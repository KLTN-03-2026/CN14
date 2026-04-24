// lay cookie
export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// het lay cookie

// ham tao cookie
export function setCookie(cname, cvalue, hours) {
  var d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000); // Chuyển giờ sang mili giây
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

// het ham tao cookie

// xoa cookie 
export function deleteCookie(cname) {
  // document.cookie = `${cname}=; expires=Thu, 01 Ja 1970 00:00:00 UTC`;
  // Xóa cookie với nhiều khả năng thiết lập khác nhau
  const paths = ["/", "/subpath"];
  const domains = [window.location.hostname, `.${window.location.hostname}`];

  paths.forEach(path => {
    domains.forEach(domain => {
      document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};domain=${domain}`;
    });
    document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
  });
}
// het ham xoa 

// xoa cookie
export function deleteTokenCookie() {
  const cookieName = "token";
  document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}
