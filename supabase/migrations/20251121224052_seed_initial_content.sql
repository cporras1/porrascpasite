/*
  # Seed Initial Website Content

  1. Pages
    - Create main navigation pages
    - Home, About, Services, Contact pages
  
  2. Services
    - Populate all service categories and items
  
  3. Page Sections
    - Create homepage sections
*/

-- Insert Main Pages
INSERT INTO pages (slug, title, meta_description, show_in_nav, nav_order, is_published) VALUES
('home', 'Home', 'Professional accounting and tax services in El Paso, TX', false, 0, true),
('about', 'About', 'Learn about Porras CPA - our values, team, and commitment to excellence', true, 1, true),
('services', 'Services', 'Comprehensive accounting, tax, and QuickBooks services for businesses and individuals', true, 2, true),
('contact', 'Contact', 'Get in touch with Porras CPA for professional accounting services', true, 3, true);

-- Get page IDs for reference
DO $$
DECLARE
  home_id uuid;
  about_id uuid;
  services_id uuid;
  contact_id uuid;
BEGIN
  SELECT id INTO home_id FROM pages WHERE slug = 'home';
  SELECT id INTO about_id FROM pages WHERE slug = 'about';
  SELECT id INTO services_id FROM pages WHERE slug = 'services';
  SELECT id INTO contact_id FROM pages WHERE slug = 'contact';

  -- Home Page Sections
  INSERT INTO page_sections (page_id, section_type, title, content, section_order) VALUES
  (home_id, 'hero', 'Professional Accounting & Tax Services', 'Combining expertise, experience, and dedication to provide outstanding service to our clients in El Paso and surrounding areas.', 1),
  (home_id, 'features', 'Why Choose Porras CPA?', 'We are committed to three core principles: Professionalism, Responsiveness, and Quality. Our goal is to be your trusted advisor, providing insightful advice to help you make informed financial decisions.', 2),
  (home_id, 'cta', 'Ready to Get Started?', 'Contact us today for a consultation and discover how we can help your business succeed.', 3);

  -- About Page Sections
  INSERT INTO page_sections (page_id, section_type, title, content, section_order) VALUES
  (about_id, 'text', 'Our Values', 'At Porras CPA, P.C., we are committed to outstanding service to our clients. We combine our expertise, experience, and the energy of our staff to ensure each client receives close personal and professional attention.', 1),
  (about_id, 'text', 'Professionalism', 'By combining our expertise, experience and the energy of our staff, each client receives close personal and professional attention. We are considered one of the leading firms in our area.', 2),
  (about_id, 'text', 'Responsiveness', 'We provide comprehensive financial services to individuals and businesses. We grow through client referrals and are known for competent advice and fast, accurate personnel.', 3),
  (about_id, 'text', 'Quality', 'Our primary goal is to be a trusted advisor providing insightful financial advice. We are committed to continuous professional education to help clients make informed financial decisions.', 4);

  -- Contact Page Sections
  INSERT INTO page_sections (page_id, section_type, title, content, section_order) VALUES
  (contact_id, 'contact_form', 'Get in Touch', 'Have questions? We are here to help. Fill out the form below and we will get back to you as soon as possible.', 1);
END $$;

-- Insert Business Services
INSERT INTO services (category, title, slug, description, full_content, display_order, is_featured) VALUES
('Business', 'Small Business Accounting', 'small-business-accounting', 'As a small business owner you have more important things to do than to keep your own books.', 'We offer comprehensive accounting services tailored to small businesses, allowing you to focus on growing your business while we handle the numbers.', 1, true),
('Business', 'Payroll Services', 'payroll-services', 'We offer payroll solutions that meet your business''s needs', 'Complete payroll processing services including tax calculations, direct deposits, and compliance reporting.', 2, true),
('Business', 'Part-Time CFO Services', 'part-time-cfo-services', 'A professional financial manager who works with you to help guide your business to success', 'Strategic financial guidance without the full-time CFO cost. We provide expert financial planning and analysis.', 3, true),
('Business', 'Auditing Services', 'auditing-services', 'Three levels of assurance to meet different stockholder, creditor, and investor needs', 'Professional audit, review, and compilation services to meet your financial reporting requirements.', 4, false),
('Business', 'Cash Flow Management', 'cash-flow-management', 'Develop a cash flow projection to avoid a potential business-killing cash crisis', 'Comprehensive cash flow analysis and forecasting to ensure your business stays financially healthy.', 5, false),
('Business', 'Bank Financing Assistance', 'bank-financing-assistance', 'Prepare and organize your approach for business loan requests to reduce perceived risk', 'Expert assistance in preparing financial packages for bank loan applications.', 6, false),
('Business', 'Strategic Business Planning', 'strategic-business-planning', 'Help clarify your company''s direction by preparing a strategic plan', 'Comprehensive business planning services to help chart your company''s future success.', 7, false),
('Business', 'Succession Planning', 'succession-planning', 'Essential planning for family business survival across generations', 'Ensure smooth transition of your business to the next generation with proper planning.', 8, false),
('Business', 'New Business Formation', 'new-business-formation', 'Guidance beyond the initial excitement of starting a business', 'Complete support for entity selection, registration, and initial setup of your new business.', 9, false),
('Business', 'Non-Profit Organizations', 'non-profit-organizations', 'Assist with IRS-specific revenue and expense classifications', 'Specialized accounting and compliance services for non-profit organizations.', 10, false),
('Business', 'Internal Controls', 'internal-controls', 'Evaluate operational efficiency and recommend improvements to strengthen the company', 'Assessment and implementation of internal controls to protect your business assets.', 11, false);

-- Insert Tax Services
INSERT INTO services (category, title, slug, description, full_content, display_order, is_featured) VALUES
('Tax', 'Tax Preparation', 'tax-preparation', 'Professional tax preparation services for individuals and businesses', 'According to studies, most taxpayers benefit from using a professional tax preparer. We ensure accuracy and maximize your deductions.', 1, true),
('Tax', 'Tax Planning', 'tax-planning', 'Planning is the key to successfully and legally reducing your tax liability', 'We go beyond tax compliance and proactively recommend tax saving strategies to maximize your after-tax income.', 2, true),
('Tax', 'IRS Problem Resolution', 'irs-problem-resolution', 'We''re here to help you resolve your tax problems and put an end to the misery', 'Efficient, affordable, and discreet assistance with IRS issues including audits, liens, and payment plans.', 3, true),
('Tax', 'IRS Audit Representation', 'irs-audit-representation', 'Professional representation during IRS audits', 'We represent you before the IRS to ensure your rights are protected during the audit process.', 4, false),
('Tax', 'Back Taxes Owed', 'back-taxes-owed', 'Help resolving back tax obligations', 'Assistance in addressing and resolving outstanding tax liabilities with the IRS.', 5, false),
('Tax', 'Payroll Tax Problems', 'payroll-tax-problems', 'Resolution of payroll tax issues', 'Expert help with payroll tax compliance and resolution of payroll tax problems.', 6, false),
('Tax', 'IRS Liens & Levies', 'irs-liens-levies', 'Help with IRS liens and levies', 'Assistance in removing or reducing IRS liens and levies on your property.', 7, false),
('Tax', 'Offer In Compromise', 'offer-in-compromise', 'Settle your tax debt for less than the full amount', 'Negotiate with the IRS to settle your tax debt for less than you owe.', 8, false);

-- Insert QuickBooks Services
INSERT INTO services (category, title, slug, description, full_content, display_order, is_featured) VALUES
('QuickBooks', 'QuickBooks Setup', 'quickbooks-setup', 'Save hours of frustration with professional setup assistance', 'Professional QuickBooks installation and configuration tailored to your business needs.', 1, true),
('QuickBooks', 'QuickBooks Training', 'quickbooks-training', 'Train employees to properly operate QuickBooks for your business', 'Comprehensive training to help you and your staff use QuickBooks effectively.', 2, true),
('QuickBooks', 'QuickAnswers', 'quickanswers', 'Email and telephone support for your QuickBooks questions', 'Ongoing support to answer your QuickBooks questions and resolve issues quickly.', 3, false),
('QuickBooks', 'QuickTune-up', 'quicktune-up', 'Clean up problem areas and prepare books for tax time', 'Comprehensive review and cleanup of your QuickBooks file to ensure accuracy.', 4, false),
('QuickBooks', 'QuickBooks Tips', 'quickbooks-tips', 'Shortcuts to save time and improve productivity', 'Learn tips and tricks to make your QuickBooks experience more efficient.', 5, false),
('QuickBooks', 'QuickBooks Purchase', 'quickbooks-purchase', 'Get discounts up to 20% on the newest version', 'Purchase QuickBooks at discounted rates through our partnership.', 6, false);

-- Insert Industry Services
INSERT INTO services (category, title, slug, description, full_content, display_order, is_featured) VALUES
('Industries', 'Construction', 'construction', 'Specialized accounting for construction companies', 'Industry-specific accounting services for contractors and construction businesses.', 1, false),
('Industries', 'Dentists', 'dentists', 'Accounting services tailored for dental practices', 'Financial management and tax services designed for dental professionals.', 2, false),
('Industries', 'Healthcare', 'healthcare', 'Healthcare practice accounting and advisory', 'Specialized services for medical practices and healthcare providers.', 3, false),
('Industries', 'Hospitality', 'hospitality', 'Restaurant and hospitality accounting', 'Accounting solutions for restaurants, hotels, and hospitality businesses.', 4, false),
('Industries', 'Law Firms', 'law-firms', 'Accounting for legal practices', 'Trust accounting and financial services for law firms and attorneys.', 5, false),
('Industries', 'Manufacturers', 'manufacturers', 'Manufacturing accounting services', 'Cost accounting and financial management for manufacturing businesses.', 6, false),
('Industries', 'Real Estate', 'real-estate', 'Real estate accounting and advisory', 'Specialized services for real estate investors and property management.', 7, false);
