from jinja2 import Template

instructions_template = Template(
    """I need you to generate 3-4 bullet points that I can put under positions in my resume that are tailored to a specific position. Additionally, I need you to select the top 8 languages and top 8 tools that I should highlight (in sorted order) from a list I provide you, all of which reflect the languages and tools needed for the position. If one of my previous positions does not have a lot of relevant experience for the job description only put 3 bullet points.

I will need you to populate bullet points for 3 positions ({{ all_positions }})

The format you should return this response should look like the following:

{ "positions": { {{ positions_schema }} }, "languages": [languages], "tools": [tools] }

Here is a detailed summary of each of my positions.

{% for position in positions %}
{{ position.company }} - {{ position.position }} ({{ position.start }} - {{ position.end }})
{{ position.description }}
{% endfor %}

Here are the languages and tools you should select from do not modify the values in these lists when you return your answer. 
You should order the returned languages and tools such that those that match the description the most are at the front of the list.

Languages I know
{{ languages }}

Tools I know
{{ tools }}

Here is the job description that the bullet points and selected languages/tools should reflect 

{{ job_description }}
"""
)
