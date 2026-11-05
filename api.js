/* api.js - bridge between the web page (GitHub Pages) and the Apps Script backend.
 * It re-creates google.script.run, so the existing page code works without changes.
 * 1) Put your Web app URL below (Apps Script > Deploy > Manage deployments > Web app URL, ends with /exec)
 * 2) Upload this file next to index.html in the GitHub repo.
 */
const API_URL = 'https://script.google.com/macros/s/AKfycbylxm92sTqK1BZGQbaOKa5fwpNt-4g1GcuUhvKao5w3SVl971ilMWQyC4Oadw_HpsA6/exec';
window.google = { script: { run: (function () {
  function make(ok, fail) {
    return {
      withSuccessHandler: function (f) { return make(f, fail); },
      withFailureHandler: function (f) { return make(ok, f); },
      apiCall: function (token, fn, args) {
        if (/PASTE_YOUR/.test(API_URL)) {
          if (fail) fail(new Error('ยังไม่ได้ใส่ API_URL ในไฟล์ api.js / API_URL is not set in api.js'));
          return;
        }
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // text/plain avoids the CORS pre-flight that Apps Script cannot answer
          body: JSON.stringify({ token: token || '', fn: fn, args: args || [] })
        })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (!j || !j.ok) throw new Error((j && j.error) || 'Error');
            return j.data;
          })
          .then(
            function (d) { if (ok) ok(d); },
            function (e) {
              if (!fail) return;
              fail(e instanceof TypeError ? new Error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ / Cannot reach the server') : e);
            }
          );
      }
    };
  }
  return make(null, null);
})() } };
