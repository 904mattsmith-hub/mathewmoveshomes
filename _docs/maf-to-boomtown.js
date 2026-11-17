// MyAgentFinder → BoomTown lead parser (paste into a "Code by Zapier" → Run JavaScript step).
//
// Zap input field:  body = Gmail "Body Plain" of the MyAgentFinder "New ... Referral Contact Info" email.
// Every key in the returned object can be mapped straight into BoomTown "Create or Update Lead".
// Lives in _docs/, which Jekyll does not publish.

function parseMafReferral(body) {
  const field = (label) => {
    const m = body.match(new RegExp('^\\s*' + label + ':[ \\t]*(.*)$', 'im'));
    return m ? m[1].trim() : '';
  };

  // --- contact ---
  const fullName = field('NAME').replace(/\s+/g, ' ');
  const parts = fullName.split(' ');
  const lastName = parts.length > 1 ? parts.pop() : '';
  const firstName = parts.filter((p, i) => i === 0 || p.replace('.', '').length > 1).join(' ');

  const digits = field('CALL NOW').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  const phone = digits.length === 10 ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}` : '';
  const email = field('EMAIL');

  // --- area: ", Orange Park, Florida 32073" ---
  const area = field('ADDRESS or AREA').replace(/^[,\s]+/, '');
  const am = area.match(/^(.*?),\s*([A-Za-z ]+?)\s*(\d{5})?$/);
  const city = am ? am[1].trim() : area;
  const stateName = am ? am[2].trim() : '';
  const state = /^florida$/i.test(stateName) ? 'FL' : stateName.length === 2 ? stateName.toUpperCase() : '';
  const zipCode = am && am[3] ? am[3] : '';

  // --- money / timing / loan ---
  const prices = (field('PRICE RANGE').match(/\$?[\d,]+/g) || []).map((p) => Number(p.replace(/[$,]/g, '')));
  const priceMin = prices[0] || 0;
  const priceMax = prices[1] || priceMin;
  const avgPrice = priceMin ? Math.round((priceMin + priceMax) / 2) : '';
  const timeframe = field('TIME ?FRAME');
  const loanStatus = field('LOAN STATUS');
  const bestTime = field('BEST TIME TO REACH(?: OUT)?');
  const leadSource = field('LEAD SOURCE');
  const comments = field('ADDITIONAL COMMENTS');
  const type = field('TYPE') || 'Buyer';
  const referralUrl = (body.match(/https:\/\/app\.myagentfinder\.com\/#\/referral-details\/[\w-]+/i) || [''])[0];

  // --- follow-up rules driven by the MyAgentFinder answers ---
  const tf = timeframe.toLowerCase();
  const category = /^0\s*-\s*3/.test(tf) ? 'hot' : /^3\s*-\s*6/.test(tf) ? 'qualify' : 'nurture';

  const ls = loanStatus.toLowerCase();
  const loanStage = /pre-?approved$/.test(ls) && !/process/.test(ls) ? 'preapproved'
    : /process/.test(ls) ? 'in_process' : 'not_started';

  const src = leadSource.toLowerCase();
  const loanType = /usda/.test(src) ? 'USDA' : /fha/.test(src) ? 'FHA' : /va(loans)?\.com/.test(src) ? 'VA' : '';

  const steps = [];
  steps.push('Now: call + text within 1 hour (MAF says 48% better conversion), then mark "Trying to reach" in the MAF portal.');
  if (loanStage === 'not_started') steps.push(`Lender: offer a pre-approval intro${loanType ? ` (${loanType})` : ''} on the first call.`);
  if (loanStage === 'in_process') steps.push('Lender: ask which lender and when the pre-approval letter is expected.');
  if (loanStage === 'preapproved') steps.push('Lender: ask for the pre-approval letter and book showings this week.');
  if (loanType === 'USDA') steps.push('USDA: confirm target homes are in a USDA-eligible area before sending listings.');
  steps.push(`Search: set up MLS auto-search for ${city || 'their area'}${zipCode ? ' ' + zipCode : ''}, $${priceMin.toLocaleString()}–$${priceMax.toLocaleString()}.`);
  steps.push(category === 'hot'
    ? 'Cadence: daily touches days 1–3, then every 2 days through day 14; showings ASAP.'
    : category === 'qualify'
      ? 'Cadence: days 1, 2, 4, 7, 14, then weekly until they are active.'
      : 'Cadence: days 1, 3, 7, 14, 30, then monthly market update + new listings.');
  steps.push('MAF portal: update status every 2 days until they are a client (MAF flags overdue referrals).');

  const notes = [
    `MyAgentFinder referral (${type})`,
    `Price range: ${field('PRICE RANGE')}`,
    `Area: ${area}`,
    `Timeframe: ${timeframe}`,
    `Loan status: ${loanStatus}`,
    `Channel: ${leadSource}`,
    bestTime && `Best time to reach: ${bestTime}`,
    comments && `Comments: ${comments}`,
    referralUrl && `MAF referral: ${referralUrl}`,
    'Referral fee owed to MyAgentFinder at closing; see referral agreement for terms.',
  ].filter(Boolean).join('\n')
    + '\n\nFOLLOW-UP PLAN\n'
    + steps.map((s, i) => `${i + 1}. ${s}`).join('\n');

  return {
    firstName, lastName, email, phone, city, state, zipCode,
    avgListingPrice: avgPrice, priceMin, priceMax,
    timeframe, loanStatus, loanStage, loanType, leadSource, type,
    buyerCategory: type.toLowerCase() === 'buyer' ? category : '',
    sellerCategory: type.toLowerCase() === 'seller' ? category : '',
    referralUrl, notes,
  };
}

if (typeof inputData !== 'undefined') {
  // Running inside Code by Zapier
  output = parseMafReferral(inputData.body || '');
} else if (typeof module !== 'undefined') {
  module.exports = { parseMafReferral };
}
