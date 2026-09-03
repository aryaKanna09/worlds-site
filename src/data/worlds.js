// The 17 verticals, alphabetical. Never reordered to put one domain first.
export const CATEGORIES = [
  "BANKING & BROKERAGE",
  "COMMERCE",
  "COMMS & SCHEDULING",
  "EDUCATION",
  "ENG & IT OPS",
  "FINANCE OPS",
  "GOV & COMPLIANCE",
  "HEALTHCARE & INSURANCE",
  "HR & IDENTITY",
  "LEGAL",
  "LOGISTICS",
  "MARKETING & ADS",
  "PAYMENTS & BILLING",
  "REAL ESTATE",
  "SALES & CRM",
  "SUPPORT",
  "TRAVEL",
];

// Every world in the catalog is built and installable. `free` keeps Stripe
// sorted first and on the free tier.
const t = (id, name, domain, category, description, free = false) => ({
  id,
  name,
  domain,
  category,
  description,
  free,
});

export const worlds = [
  // SUPPORT
  t("zendesk", "Zendesk", "zendesk.com", "SUPPORT", "Tickets, macros, SLAs, escalations. Queue rules enforced."),
  t("intercom", "Intercom", "intercom.com", "SUPPORT", "Conversations, assignments, snoozes, resolution flows."),
  t("freshdesk", "Freshdesk", "freshworks.com", "SUPPORT", "Tickets, priorities, agent groups, automation triggers."),
  t("salesforce-service-cloud", "Salesforce Service Cloud", "salesforce.com", "SUPPORT", "Cases, queues, entitlements, escalation paths."),
  t("gorgias", "Gorgias", "gorgias.com", "SUPPORT", "Ecommerce tickets, order context, refund macros."),
  t("front", "Front", "front.com", "SUPPORT", "Shared inboxes, tags, assignments, reply drafts."),
  t("help-scout", "Help Scout", "helpscout.com", "SUPPORT", "Mailboxes, threads, saved replies, customer history."),
  t("kustomer", "Kustomer", "kustomer.com", "SUPPORT", "Customer timelines, routing, merges, conversation states."),

  // PAYMENTS & BILLING
  t("stripe", "Stripe", "stripe.com", "PAYMENTS & BILLING", "Payments, refunds, invoices, subscriptions. Full lifecycle rules.", true),
  t("adyen", "Adyen", "adyen.com", "PAYMENTS & BILLING", "Authorisations, captures, chargebacks, split settlements."),
  t("braintree", "PayPal Braintree", "braintreepayments.com", "PAYMENTS & BILLING", "Transactions, vaulted cards, disputes, payouts."),
  t("square", "Square", "squareup.com", "PAYMENTS & BILLING", "Charges, catalog items, terminals, refund windows."),
  t("chargebee", "Chargebee", "chargebee.com", "PAYMENTS & BILLING", "Plans, trials, proration, dunning sequences."),
  t("recurly", "Recurly", "recurly.com", "PAYMENTS & BILLING", "Subscriptions, renewals, coupons, failed-payment retries."),
  t("zuora", "Zuora", "zuora.com", "PAYMENTS & BILLING", "Rate plans, amendments, billing runs, revenue schedules."),
  t("bill-com", "Bill.com", "bill.com", "PAYMENTS & BILLING", "Invoices, approval chains, ACH runs, vendor records."),
  t("plaid", "Plaid", "plaid.com", "PAYMENTS & BILLING", "Bank links, balances, transactions, auth flows."),

  // FINANCE OPS
  t("quickbooks", "QuickBooks", "quickbooks.intuit.com", "FINANCE OPS", "Ledgers, invoices, reconciliation, tax categories."),
  t("netsuite", "NetSuite", "netsuite.com", "FINANCE OPS", "Journals, purchase orders, approvals, period closes."),
  t("xero", "Xero", "xero.com", "FINANCE OPS", "Bank feeds, bills, contacts, chart of accounts."),
  t("sage", "Sage", "sage.com", "FINANCE OPS", "Ledgers, VAT returns, supplier payments, audit trails."),
  t("ramp", "Ramp", "ramp.com", "FINANCE OPS", "Cards, limits, receipts, expense policies."),
  t("brex", "Brex", "brex.com", "FINANCE OPS", "Spend limits, cards, reimbursements, policy checks."),
  t("expensify", "Expensify", "expensify.com", "FINANCE OPS", "Reports, receipts, approvals, reimbursement rules."),
  t("adp", "ADP", "adp.com", "FINANCE OPS", "Payroll runs, deductions, garnishments, tax filings."),
  t("gusto", "Gusto", "gusto.com", "FINANCE OPS", "Payroll, benefits, contractor payments, filings."),
  t("deel", "Deel", "deel.com", "FINANCE OPS", "Contracts, global payroll, compliance docs, payouts."),

  // HR & IDENTITY
  t("workday", "Workday", "workday.com", "HR & IDENTITY", "Workers, org changes, compensation, time-off ledgers."),
  t("rippling", "Rippling", "rippling.com", "HR & IDENTITY", "Onboarding, devices, app grants, payroll in one graph."),
  t("bamboohr", "BambooHR", "bamboohr.com", "HR & IDENTITY", "Employee records, PTO balances, approvals, reviews."),
  t("okta", "Okta", "okta.com", "HR & IDENTITY", "Users, groups, app assignments, lifecycle policies."),
  t("microsoft-entra", "Microsoft Entra", "microsoft.com", "HR & IDENTITY", "Directories, roles, conditional access, tokens."),
  t("google-workspace-admin", "Google Workspace Admin", "workspace.google.com", "HR & IDENTITY", "Users, groups, drive shares, admin roles."),
  t("greenhouse", "Greenhouse", "greenhouse.io", "HR & IDENTITY", "Candidates, stages, scorecards, offer approvals."),
  t("lever", "Lever", "lever.co", "HR & IDENTITY", "Pipelines, interviews, feedback forms, requisitions."),

  // COMMERCE
  t("shopify", "Shopify", "shopify.com", "COMMERCE", "Products, orders, fulfillment, refund flows."),
  t("amazon-seller-central", "Amazon Seller Central", "amazon.com", "COMMERCE", "Listings, FBA inventory, orders, account health."),
  t("woocommerce", "WooCommerce", "woocommerce.com", "COMMERCE", "Products, coupons, orders, stock states."),
  t("bigcommerce", "BigCommerce", "bigcommerce.com", "COMMERCE", "Catalogs, carts, orders, channel listings."),
  t("walmart-marketplace", "Walmart Marketplace", "walmart.com", "COMMERCE", "Items, offers, orders, returns policies."),
  t("ebay", "eBay", "ebay.com", "COMMERCE", "Listings, bids, orders, seller metrics."),

  // SALES & CRM
  t("salesforce", "Salesforce", "salesforce.com", "SALES & CRM", "Leads, opportunities, stages, validation rules."),
  t("hubspot", "HubSpot", "hubspot.com", "SALES & CRM", "Contacts, deals, pipelines, sequences."),
  t("pipedrive", "Pipedrive", "pipedrive.com", "SALES & CRM", "Deals, stages, activities, win rules."),
  t("outreach", "Outreach", "outreach.io", "SALES & CRM", "Sequences, prospects, touches, reply handling."),
  t("salesloft", "Salesloft", "salesloft.com", "SALES & CRM", "Cadences, calls, emails, pipeline tasks."),
  t("docusign", "DocuSign", "docusign.com", "SALES & CRM", "Envelopes, signers, routing order, expirations."),

  // HEALTHCARE & INSURANCE
  t("epic-fhir", "Epic FHIR", "epic.com", "HEALTHCARE & INSURANCE", "Patients, encounters, orders, FHIR resources."),
  t("athenahealth", "Athenahealth", "athenahealth.com", "HEALTHCARE & INSURANCE", "Appointments, claims, charts, eligibility checks."),
  t("availity", "Availity", "availity.com", "HEALTHCARE & INSURANCE", "Eligibility, claim status, prior auth requests."),
  t("guidewire", "Guidewire", "guidewire.com", "HEALTHCARE & INSURANCE", "Policies, claims, endorsements, underwriting rules."),
  t("duck-creek", "Duck Creek", "duckcreek.com", "HEALTHCARE & INSURANCE", "Quotes, policies, riders, rating tables."),

  // TRAVEL
  t("amadeus", "Amadeus", "amadeus.com", "TRAVEL", "Fares, PNRs, ticketing, seat maps."),
  t("sabre", "Sabre", "sabre.com", "TRAVEL", "Bookings, itineraries, exchanges, fare rules."),
  t("booking-com", "Booking.com", "booking.com", "TRAVEL", "Rooms, rates, reservations, cancellation policies."),
  t("expedia-partner", "Expedia Partner", "expedia.com", "TRAVEL", "Inventory, bookings, rate plans, payouts."),
  t("opentable", "OpenTable", "opentable.com", "TRAVEL", "Tables, covers, reservations, no-show rules."),
  t("mews", "Mews", "mews.com", "TRAVEL", "Rooms, rates, check-ins, housekeeping states."),

  // LOGISTICS
  t("shippo", "Shippo", "goshippo.com", "LOGISTICS", "Labels, rates, manifests, tracking events."),
  t("easypost", "EasyPost", "easypost.com", "LOGISTICS", "Shipments, labels, insurance, address checks."),
  t("fedex", "FedEx", "fedex.com", "LOGISTICS", "Rates, pickups, labels, delivery scans."),
  t("ups", "UPS", "ups.com", "LOGISTICS", "Shipments, labels, tracking, delivery windows."),
  t("doordash-drive", "DoorDash Drive", "doordash.com", "LOGISTICS", "Deliveries, quotes, dasher status, refund rules."),
  t("project44", "project44", "project44.com", "LOGISTICS", "Shipments, ETAs, exceptions, carrier events."),

  // ENG & IT OPS
  t("github", "GitHub", "github.com", "ENG & IT OPS", "Repos, pull requests, reviews, branch protections."),
  t("gitlab", "GitLab", "gitlab.com", "ENG & IT OPS", "Projects, merge requests, pipelines, approval rules."),
  t("jira", "Jira", "atlassian.com", "ENG & IT OPS", "Issues, sprints, workflows, transition rules."),
  t("linear", "Linear", "linear.app", "ENG & IT OPS", "Issues, cycles, projects, triage states."),
  t("pagerduty", "PagerDuty", "pagerduty.com", "ENG & IT OPS", "Incidents, escalation policies, on-call rotations."),
  t("servicenow", "ServiceNow", "servicenow.com", "ENG & IT OPS", "Tickets, CMDB records, approvals, change windows."),
  t("datadog", "Datadog", "datadoghq.com", "ENG & IT OPS", "Monitors, alerts, dashboards, downtime windows."),

  // COMMS & SCHEDULING
  t("gmail", "Gmail", "gmail.com", "COMMS & SCHEDULING", "Threads, labels, drafts, send limits."),
  t("outlook", "Outlook", "outlook.com", "COMMS & SCHEDULING", "Mail, folders, rules, calendar invites."),
  t("google-calendar", "Google Calendar", "calendar.google.com", "COMMS & SCHEDULING", "Events, invites, rooms, conflict rules."),
  t("slack", "Slack", "slack.com", "COMMS & SCHEDULING", "Channels, threads, mentions, workspace policies."),
  t("microsoft-teams", "Microsoft Teams", "microsoft.com", "COMMS & SCHEDULING", "Chats, channels, meetings, presence states."),
  t("twilio", "Twilio", "twilio.com", "COMMS & SCHEDULING", "SMS, calls, numbers, delivery receipts."),
  t("calendly", "Calendly", "calendly.com", "COMMS & SCHEDULING", "Event types, slots, buffers, reschedule flows."),

  // LEGAL
  t("ironclad", "Ironclad", "ironcladapp.com", "LEGAL", "Contracts, workflows, approvals, clause libraries."),
  t("contractpodai", "ContractPodAi", "contractpodai.com", "LEGAL", "Repositories, obligations, renewals, review queues."),

  // GOV & COMPLIANCE
  t("irs-efile", "IRS e-file", "irs.gov", "GOV & COMPLIANCE", "Returns, schedules, rejections, acknowledgment codes."),
  t("sec-edgar", "SEC EDGAR", "sec.gov", "GOV & COMPLIANCE", "Filings, forms, CIKs, submission windows."),

  // REAL ESTATE
  t("yardi", "Yardi", "yardi.com", "REAL ESTATE", "Leases, units, rent rolls, work orders."),
  t("appfolio", "AppFolio", "appfolio.com", "REAL ESTATE", "Listings, applications, leases, maintenance queues."),
  t("buildium", "Buildium", "buildium.com", "REAL ESTATE", "Tenants, rent charges, deposits, task queues."),
  t("zillow", "Zillow", "zillow.com", "REAL ESTATE", "Listings, leads, tours, price histories."),

  // EDUCATION
  t("canvas", "Canvas", "instructure.com", "EDUCATION", "Courses, assignments, submissions, grade rules."),
  t("powerschool", "PowerSchool", "powerschool.com", "EDUCATION", "Students, enrollment, attendance, grade books."),

  // MARKETING & ADS
  t("google-ads", "Google Ads", "ads.google.com", "MARKETING & ADS", "Campaigns, budgets, bids, policy checks."),
  t("meta-ads", "Meta Ads", "facebook.com", "MARKETING & ADS", "Ad sets, audiences, budgets, review states."),
  t("klaviyo", "Klaviyo", "klaviyo.com", "MARKETING & ADS", "Flows, segments, campaigns, send limits."),
  t("mailchimp", "Mailchimp", "mailchimp.com", "MARKETING & ADS", "Audiences, campaigns, automations, bounce handling."),
  t("braze", "Braze", "braze.com", "MARKETING & ADS", "Canvases, segments, sends, frequency caps."),

  // BANKING & BROKERAGE
  t("unit", "Unit", "unit.co", "BANKING & BROKERAGE", "Accounts, cards, payments, KYC states."),
  t("treasury-prime", "Treasury Prime", "treasuryprime.com", "BANKING & BROKERAGE", "Accounts, wires, ACH, ledger entries."),
  t("column", "Column", "column.com", "BANKING & BROKERAGE", "Accounts, wires, ACH returns, book transfers."),
  t("alpaca", "Alpaca", "alpaca.markets", "BANKING & BROKERAGE", "Orders, positions, fills, market sessions."),
];

// Single source of truth for every world count rendered on the site.
export const WORLD_COUNT = worlds.length;

// Install command per world, slug derived from the name (never hand-written).
export const pipCommand = (name) =>
  `pip install worlds-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

// The homepage logo wall and catalog teaser: the most recognizable systems we
// offer, all present in the catalog above.
export const featuredWorldIds = [
  "stripe",
  "shopify",
  "zendesk",
  "salesforce",
  "okta",
  "workday",
  "quickbooks",
  "hubspot",
  "github",
  "gmail",
  "twilio",
  "netsuite",
];

export const featuredWorlds = featuredWorldIds.map((id) => worlds.find((w) => w.id === id));
