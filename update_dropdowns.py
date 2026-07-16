import re

with open('frontend/src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace branch
content = content.replace('<option value="বালিকা শাখা">বালিকা শাখা</option>', '<option value="দ্বিতীয় শাখা">দ্বিতীয় শাখা</option>')

new_class_block = '''<option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="9th">৯ম শ্রেণি</option>
                <option value="10th">১০ম শ্রেণি</option>
                <option value="HSC-1">এইচএসসি ১ম বর্ষ</option>
                <option value="HSC-2">এইচএসসি ২য় বর্ষ</option>'''

pattern = re.compile(r'<option value="9th">৯ম শ্রেণি</option>\s*<option value="10th">১০ম শ্রেণি</option>\s*<option value="HSC-1">এইচএসসি ১ম বর্ষ</option>\s*<option value="HSC-2">এইচএসসি ২য় বর্ষ</option>')

content = pattern.sub(new_class_block, content)

with open('frontend/src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Replaced dropdown options successfully.')
