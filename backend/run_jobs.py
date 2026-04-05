import os
import sys
import asyncio

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from agent_system.jobs import run_bill_job, run_news_job

async def main():
    print("Running bill job...")
    await run_bill_job()
    print("Running news job...")
    await run_news_job()
    print("Jobs completed.")

if __name__ == "__main__":
    asyncio.run(main())
