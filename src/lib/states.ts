/**
 * States and union territories, for the checkout.
 *
 * A list rather than a text box, and the reason is tax rather than tidiness.
 * The state decides the place of supply, which decides whether a sale carries
 * CGST+SGST or IGST. "MP", "M.P." and "Madhya Pradesh" typed into a free text
 * box are three different answers to a question that has one, and the server
 * rejects anything it cannot map to a GST code, so a typo here is a checkout
 * that fails at the last step instead of a tax split that is quietly wrong.
 *
 * The names match the keys the server maps from. Keep the two in step.
 */

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const

/** Where the goods ship from, and so the default the form opens on. */
export const HOME_STATE = 'Madhya Pradesh'
