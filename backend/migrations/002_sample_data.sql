-- Sample applications
INSERT INTO applications (id, family_id, family_status, business_owner, tax_filing) VALUES
    ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'new', true, 'filed'),
    ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'returning', false, 'not_filed'),
    ('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', 'new', true, 'not_filed');

-- Sample rules for different scenarios
INSERT INTO rules (id, name) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'New Family Document Request'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tax Filing Verification')
RETURNING id, name;

-- Conditions for the rules
INSERT INTO conditions (id, rule_id, condition_type, condition_value) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'family_status', 'new'),
    (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'business_owner', 'true'),
    (uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'tax_filing', 'not_filed')
RETURNING id, rule_id, condition_type, condition_value;

-- Required documents for each rule
INSERT INTO documents (id, rule_id, document_type) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tax_return'),
    (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'business_docs'),
    (uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'income_verification')
RETURNING id, rule_id, document_type;

-- Sample rule matches
INSERT INTO rule_matches (id, rule_id, application_id) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
    (uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'); 