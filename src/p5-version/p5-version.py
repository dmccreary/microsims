#!/usr/bin/env python3
"""
Find the latest version of the p5.js library hosted on jsDelivr CDN.
"""

import requests

def get_latest_p5_version():
    url = "https://data.jsdelivr.com/v1/package/npm/p5"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        latest = data.get("tags", {}).get("latest")
        if latest:
            print(f"Latest p5.js version: {latest}")
            print("CDN URL:")
            print(f"https://cdn.jsdelivr.net/npm/p5@{latest}/lib/p5.min.js")
        else:
            print("Could not find 'latest' tag in jsDelivr API response.")
    except Exception as e:
        print(f"Error retrieving version: {e}")

if __name__ == "__main__":
    get_latest_p5_version()
