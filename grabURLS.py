import re
import json
import pyperclip

# Made just to make the making of videos.json easier
# This is mostly made using AI

def replace_lines(input1, input2):
    details_dict = {}
    for line in input2.strip().split('\n'):
        link, details = line.split(' ', 1)
        details_dict[link] = details

    output = []
    for line in input1.strip().split('\n'):
        time, link = line.split('- ')
        output.append(f"{time}- {link} {details_dict.get(link, '')}")

    return '\n'.join(output)

def process_text(text):
    seconds_pattern = r"(^|\n)(\d+):(\d+)-"
    video_id_pattern = r"(youtu.be/|watch?v=)(\S+)(?=\n|\s| |$)"
    atomic_number_pattern = r'(?<=[ =])(\d+)(?=\))'
    xxxv_pattern = r'(?<= )([xX]{3}[vV])(?=\n| |$)'

    results = []

    for line in text.splitlines():
        seconds_match = re.search(seconds_pattern, line)
        if seconds_match:
            minutes, seconds = int(seconds_match.group(2)), int(seconds_match.group(3))
            total_seconds = (minutes * 60) + seconds
        else:
            total_seconds = None

        video_id_match = re.search(video_id_pattern, line)
        video_id = video_id_match.group(2) if video_id_match else None

        atomic_number_match = re.search(atomic_number_pattern, line)
        atomic_number = int(atomic_number_match.group(1)) if atomic_number_match else None

        xxxv_match = re.search(xxxv_pattern, line)
        is_xxxv = bool(xxxv_match)

        if any([total_seconds, video_id, atomic_number, is_xxxv]):
            result = {}
            if total_seconds:
                result["seconds"] = total_seconds
            if video_id:
                result["id"] = video_id
            if atomic_number:
                result["atomic_number"] = atomic_number
            result["xxxv"] = is_xxxv

            results.append(result)

    return json.dumps(results, indent=2)

def extract_netlify_info(text):
    matches = []
    seen = set()
    for line in text.split('\n'):
        match = re.search(r"(\d+:\d+).*?([a-zA-Z0-9_-]{11})", line)
        if match:
            time, id = match.groups()
            if id not in seen:
                seen.add(id)
                matches.append(f"{time}- youtu.be/{id}")
    return '\n'.join(matches) if matches else None

def get_ids(json_string):
    data = json.loads(json_string)
    id_list = [item['id'] for item in data]
    return ','.join(id_list)

# Test the function
text = """
"""

output = process_text(text)
print(output)
input = input("Do you want to copy (y)/(n): ")
if input[0].lower() == 'y':
	pyperclip.copy(output)