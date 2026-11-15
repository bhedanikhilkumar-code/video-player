// Interactive repaints yield in batches. Wait for the real completion condition,
// not a fixed delay or the html lang attribute (which changes immediately).
module.exports = async function languageTap(page) {
  await page.locator('#langBtn').click();
  await page.waitForFunction(() => document.getElementById('langBtn').getAttribute('aria-busy') !== 'true');
};
