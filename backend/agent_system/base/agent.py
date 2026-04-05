from google.adk.agents import LlmAgent
from agent_system.base.prompt import BASE_AGENT_SYSTEM_PROMPT, BASE_AGENT_DESCRIPTION
from agent_system.base.tools import BASE_TOOLS

base_agent = LlmAgent(
    name="nepal_parliament_agent",
    model="gemini-2.0-flash",
    description=BASE_AGENT_DESCRIPTION,
    instruction=BASE_AGENT_SYSTEM_PROMPT,
    tools=BASE_TOOLS,
)
