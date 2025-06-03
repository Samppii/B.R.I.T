# Dictionary of exact script dialogues
SCRIPT_DIALOGUES = {
    # Day 1
    # Original greetings
    "hey brit": "Hello inventors, how can I help you?",
    "hello brit": "Hello inventors, how can I help you?",
    "hi brit": "Hello inventors, how can I help you?",

    # Speech recognition variations
    "hey brett": "Hello inventors, how can I help you?",
    "hey britt": "Hello inventors, how can I help you?",
    "hey bread": "Hello inventors, how can I help you?",
    "hey brit": "Hello inventors, how can I help you?",
    "hey bridge": "Hello inventors, how can I help you?",
    "hey breath": "Hello inventors, how can I help you?",
    "hey bret": "Hello inventors, how can I help you?",

    # Other variations
    "hey b r i t": "Hello inventors, how can I help you?",
    "brit": "Hello inventors, how can I help you?",
    "brett": "Hello inventors, how can I help you?",
    "can you remind us what harvey needed us to find": "Harvey gave us explicit instructions to find the supplies he needs to build the \"Emotional Shrink Ray\". Before we begin, you will need to assemble your 3D glasses found in your inventors Lab book.",
    "can you find a verse in the bible that talks about working as a team": "Ecclesiastes 4:9 says 'Two people are better than one. They can help each other in everything they do.'",
    "we found all the pieces for harvey to put together the emotional shrink ray. can you pull up a blueprint of how it all goes together": "Philippian's 4:13 says, \"I can do all things through Christ because he gives me strength.\"",

    # Day 2
    "how do we find the esr in such a big space when we're so small": "It is going to be difficult to find the ESR, but Harvey has an invention that can help us. It is called a thermal lens. First, you need to assemble it. Assemble the magnifying glass and equip it with the thermal red lens.",
    "can you find a bible verse to encourage us to trust god": "Isaiah 41:10 says, \"So do not be afraid. I am with you. Do not be terrified. I am your God.\"",
    "our thermal lenses revealed that the esr is on the shelf. can you zoom in on the shelf to see if it is there": "I'd be happy to assist you in your search.",

    # Day 3
    "can you give us our instructions to help harvey": "I could give you your instructions, but I think that it would be wiser for you to watch this Bible story video first. The Bible should always be the first place you look.",
    "how does that bible story help us figure out what's wrong with the esr": "Great question. All of the followers must have been so confused when Paul completely changed his way of thinking and became a follower of Jesus. Everything probably seemed mixed-up and upside down when the guy who used to be against them was now teaching others about Jesus.\n\nTo figure out what's wrong with the ESR, you will need to unscramble some mixed-up words, so that Harvey can fix it and completely change everyone back to your regular size. Once you unscramble the mixed-up words, report back to me with the highlighted letters, so that we can figure out the bonus word.",
    "here are the highlighted letters. they are a, d, j, u, s, t, m, e, n, t. can you put those into your database to figure out what is wrong with the esr": "Yes, I am going to mix up the words and give you a couple possibilities of what the problem might be. Inventors, tell me what you think is the right answer.",
    "does the esr need an adjustment": "Yes, that's correct. Brilliant work inventors! We must let Harvey know immediately."
}


def get_script_response(user_input):
    """
    Match user input to script dialogues
    """
    normalized_input = user_input.lower().strip().replace("?", "").replace("!", "")

    # Direct match
    if normalized_input in SCRIPT_DIALOGUES:
        return SCRIPT_DIALOGUES[normalized_input]

    if "highlighted letters" in normalized_input and "a, d, j, u, s, t, m, e, n, t" or "d, j, u, s, t, m, e, n, t" in normalized_input:
        return SCRIPT_DIALOGUES[
            "here are the highlighted letters. they are a, d, j, u, s, t, m, e, n, t. can you put those into your database to figure out what is wrong with the esr"]

    if "blueprint" in normalized_input and "emotional shrink" in normalized_input:
        return SCRIPT_DIALOGUES[
            "we found all the pieces for harvey to put together the emotional shrink ray. can you pull up a blueprint of how it all goes together"]


    # Try to find the closest match for partial inputs
    for key, response in SCRIPT_DIALOGUES.items():
        # Important keywords to look for
        keywords = ["harvey", "esr", "emotional shrink", "blueprint", "bible verse",
                    "thermal", "shelf", "highlighted", "adjustment"]

        # Check if the key contains significant parts of the input or vice versa
        if (any(word in normalized_input for word in key.split() if len(word) > 3) and
                any(keyword in normalized_input for keyword in keywords)):
            return response

    # No match found
    return None