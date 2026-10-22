const mediumProblems = [
  {
    id: "M1",
    title: "Item List Manager",
    difficulty: "Medium",
    description: "Create a React application called 'Item List Manager' that displays a list of items and allows users to add new items to the list. Items should be displayed in an unordered list (`<ul>`).\n\n### Requirements\n- When the application loads, it should display an empty list.\n- The input field (textbox) should accept user text input.\n- When the button is clicked, the text from the input field is added to the list and the input field is cleared.\n- If the input field is empty or contains only whitespace, clicking the button should not add anything.",
    constraints: ["Input should not add empty or whitespace-only elements.", "Render list inside a 'ul' element and items as 'li' elements with 'listitem' role."],
    starter_code: {
      typescript: "import React, { useState } from 'react';\n\nexport default function ItemListManager() {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport ItemListManager from "./ItemListManager";\nimport React from "react";\n\ndescribe("M1 - Item List Manager (sample)", () => {\n  it("renders with an empty list initially", () => {\n    render(<ItemListManager />);\n    expect(screen.queryAllByRole("listitem")).toHaveLength(0);\n  });\n  it("adds an item when text is entered and button is clicked", () => {\n    render(<ItemListManager />);\n    fireEvent.change(screen.getByRole("textbox"), { target: { value: "First Item" } });\n    fireEvent.click(screen.getByRole("button", { name: /add item/i }));\n    expect(screen.getByText("First Item")).toBeInTheDocument();\n  });\n  it("clears the input field after adding an item", () => {\n    render(<ItemListManager />);\n    const input = screen.getByRole("textbox");\n    fireEvent.change(input, { target: { value: "Item" } });\n    fireEvent.click(screen.getByRole("button", { name: /add item/i }));\n    expect(input).toHaveValue("");\n  });\n  it("does not add empty item when input is blank", () => {\n    render(<ItemListManager />);\n    fireEvent.click(screen.getByRole("button", { name: /add item/i }));\n    expect(screen.queryAllByRole("listitem")).toHaveLength(0);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport ItemListManager from "./ItemListManager";\nimport React from "react";\n\ndescribe("M1 - Item List Manager (hidden)", () => {\n  it("adds multiple items in order", () => {\n    render(<ItemListManager />);\n    const input = screen.getByRole("textbox");\n    const btn = screen.getByRole("button", { name: /add item/i });\n\n    fireEvent.change(input, { target: { value: "First" } });\n    fireEvent.click(btn);\n    fireEvent.change(input, { target: { value: "Second" } });\n    fireEvent.click(btn);\n\n    const items = screen.getAllByRole("listitem");\n    expect(items).toHaveLength(2);\n    expect(items[0]).toHaveTextContent("First");\n    expect(items[1]).toHaveTextContent("Second");\n  });\n  it("does not add whitespace-only input", () => {\n    render(<ItemListManager />);\n    fireEvent.change(screen.getByRole("textbox"), { target: { value: "   " } });\n    fireEvent.click(screen.getByRole("button", { name: /add item/i }));\n    expect(screen.queryAllByRole("listitem")).toHaveLength(0);\n  });\n  it("renders items inside a <ul> element", () => {\n    const { container } = render(<ItemListManager />);\n    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Item" } });\n    fireEvent.click(screen.getByRole("button", { name: /add item/i }));\n    expect(container.querySelector("ul")).not.toBeNull();\n    expect(container.querySelectorAll("li")).toHaveLength(1);\n  });\n  it("can add 10+ items without issue", () => {\n    render(<ItemListManager />);\n    const input = screen.getByRole("textbox");\n    const btn = screen.getByRole("button", { name: /add item/i });\n    for (let i = 1; i <= 10; i++) {\n      fireEvent.change(input, { target: { value: \`Item \${i}\` } });\n      fireEvent.click(btn);\n    }\n    expect(screen.getAllByRole("listitem")).toHaveLength(10);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "renders with an empty list initially", is_hidden: false },
      { test_name: "adds an item when text is entered and button is clicked", is_hidden: false },
      { test_name: "clears the input field after adding an item", is_hidden: false },
      { test_name: "does not add empty item when input is blank", is_hidden: false },
      { test_name: "adds multiple items in order", is_hidden: true },
      { test_name: "does not add whitespace-only input", is_hidden: true },
      { test_name: "renders items inside a <ul> element", is_hidden: true },
      { test_name: "can add 10+ items without issue", is_hidden: true }
    ]
  },
  {
    id: "M2",
    title: "Code Review Feedback",
    difficulty: "Medium",
    description: "Create a React application called 'Code Review Feedback' that tracks upvote and downvote counts for five code quality aspects: Readability, Performance, Security, Documentation, and Testing.\n\n### Requirements\n- Display all five aspects with independent 'Upvote' and 'Downvote' buttons.\n- Initial count for upvotes and downvotes for all aspects is `0`.\n- Clicking Upvote increments that aspect's upvote count; Downvote increments its downvote count.\n- Counts must be updated in the UI immediately.",
    constraints: [],
    starter_code: {
      typescript: "import React, { useState } from 'react';\n\nexport default function CodeReviewFeedback() {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport CodeReviewFeedback from "./CodeReviewFeedback";\nimport React from "react";\n\ndescribe("M2 - Code Review Feedback (sample)", () => {\n  it("renders all five aspects", () => {\n    render(<CodeReviewFeedback />);\n    ["Readability","Performance","Security","Documentation","Testing"].forEach(a => {\n      expect(screen.getByText(new RegExp(a, "i"))).toBeInTheDocument();\n    });\n  });\n  it("initial counts are all 0", () => {\n    render(<CodeReviewFeedback />);\n    const zeros = screen.getAllByText("0");\n    expect(zeros.length).toBeGreaterThanOrEqual(10); // 5 aspects * 2 counts\n  });\n  it("increments upvote count for Readability", () => {\n    render(<CodeReviewFeedback />);\n    const upvoteBtns = screen.getAllByRole("button", { name: /upvote/i });\n    fireEvent.click(upvoteBtns[0]);\n    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);\n  });\n  it("increments downvote count independently", () => {\n    render(<CodeReviewFeedback />);\n    const downvoteBtns = screen.getAllByRole("button", { name: /downvote/i });\n    fireEvent.click(downvoteBtns[1]); // Performance downvote\n    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport CodeReviewFeedback from "./CodeReviewFeedback";\nimport React from "react";\n\ndescribe("M2 - Code Review Feedback (hidden)", () => {\n  it("upvote and downvote counts update independently per aspect", () => {\n    render(<CodeReviewFeedback />);\n    const upBtns = screen.getAllByRole("button", { name: /upvote/i });\n    const downBtns = screen.getAllByRole("button", { name: /downvote/i });\n\n    fireEvent.click(upBtns[2]); // Security upvote\n    fireEvent.click(upBtns[2]);\n    fireEvent.click(downBtns[2]); // Security downvote\n\n    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);\n    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);\n  });\n  it("clicking upvote 5 times shows count of 5", () => {\n    render(<CodeReviewFeedback />);\n    const upBtns = screen.getAllByRole("button", { name: /upvote/i });\n    for (let i = 0; i < 5; i++) fireEvent.click(upBtns[0]);\n    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1);\n  });\n  it("each aspect has exactly one Upvote and one Downvote button", () => {\n    render(<CodeReviewFeedback />);\n    expect(screen.getAllByRole("button", { name: /upvote/i })).toHaveLength(5);\n    expect(screen.getAllByRole("button", { name: /downvote/i })).toHaveLength(5);\n  });\n  it("counts do not affect sibling aspects", () => {\n    render(<CodeReviewFeedback />);\n    const upBtns = screen.getAllByRole("button", { name: /upvote/i });\n    fireEvent.click(upBtns[4]); // Testing upvote only\n    expect(screen.getAllByText("1").length).toBe(1);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "renders all five aspects", is_hidden: false },
      { test_name: "initial counts are all 0", is_hidden: false },
      { test_name: "increments upvote count for Readability", is_hidden: false },
      { test_name: "increments downvote count independently", is_hidden: false },
      { test_name: "upvote and downvote counts update independently per aspect", is_hidden: true },
      { test_name: "clicking upvote 5 times shows count of 5", is_hidden: true },
      { test_name: "each aspect has exactly one Upvote and one Downvote button", is_hidden: true },
      { test_name: "counts do not affect sibling aspects", is_hidden: true }
    ]
  },
  {
    id: "M3",
    title: "Contact Form",
    difficulty: "Medium",
    description: "Create a React application called 'Contact Form' that collects Name, Email, and Message, validates them, and displays submitted data below the form.\n\n### Requirements\n- Fields: Name (text input), Email (text input), Message (textarea).\n- Validate that no fields are empty on submit; show 'All fields are required.' error if any are.\n- On successful submission, display submitted data below the form and clear all fields.\n- Inputs should have clean matching labels (`name`, `email`, `message`).",
    constraints: ["Label linkages must be linked via htmlFor or wrapped labels."],
    starter_code: {
      typescript: "import React, { useState } from 'react';\n\nexport default function ContactForm() {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport ContactForm from "./ContactForm";\nimport React from "react";\n\ndescribe("M3 - Contact Form (sample)", () => {\n  it("renders all form fields and submit button", () => {\n    render(<ContactForm />);\n    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();\n    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();\n    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();\n    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();\n  });\n  it("shows error when any field is empty", () => {\n    render(<ContactForm />);\n    fireEvent.click(screen.getByRole("button", { name: /submit/i }));\n    expect(screen.getByText("All fields are required.")).toBeInTheDocument();\n  });\n  it("displays submitted data below form on valid submission", () => {\n    render(<ContactForm />);\n    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });\n    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });\n    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Hello there!" } });\n    fireEvent.click(screen.getByRole("button", { name: /submit/i }));\n    expect(screen.getByText("John Doe")).toBeInTheDocument();\n    expect(screen.getByText("john@example.com")).toBeInTheDocument();\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport ContactForm from "./ContactForm";\nimport React from "react";\n\ndescribe("M3 - Contact Form (hidden)", () => {\n  it("clears all fields after successful submission", () => {\n    render(<ContactForm />);\n    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Jane" } });\n    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "jane@test.com" } });\n    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Hi" } });\n    fireEvent.click(screen.getByRole("button", { name: /submit/i }));\n\n    expect(screen.getByLabelText(/name/i)).toHaveValue("");\n    expect(screen.getByLabelText(/email/i)).toHaveValue("");\n    expect(screen.getByLabelText(/message/i)).toHaveValue("");\n  });\n  it("does not show submitted data if validation fails", () => {\n    render(<ContactForm />);\n    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John" } });\n    fireEvent.click(screen.getByRole("button", { name: /submit/i }));\n    expect(screen.queryByText("John")).not.toBeInTheDocument();\n  });\n  it("error message disappears after successful submission", () => {\n    render(<ContactForm />);\n    fireEvent.click(screen.getByRole("button", { name: /submit/i }));\n    expect(screen.getByText("All fields are required.")).toBeInTheDocument();\n\n    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Sam" } });\n    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "s@s.com" } });\n    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Hi" } });\n    fireEvent.click(screen.getByRole("button", { name: /submit/i }));\n\n    expect(screen.queryByText("All fields are required.")).not.toBeInTheDocument();\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "renders all form fields and submit button", is_hidden: false },
      { test_name: "shows error when any field is empty", is_hidden: false },
      { test_name: "displays submitted data below form on valid submission", is_hidden: false },
      { test_name: "clears all fields after successful submission", is_hidden: true },
      { test_name: "does not show submitted data if validation fails", is_hidden: true },
      { test_name: "error message disappears after successful submission", is_hidden: true }
    ]
  },
  {
    id: "M4",
    title: "Patient Medical Records",
    difficulty: "Medium",
    description: "Create a React application called 'Patient Medical Records' with two components: Search (dropdown + Show button) and Records (table + Next button). Load 3 patients from `medicalRecords.js`. Cycle through records with the Next button, looping back to the first patient after the last.\n\n### Requirements\n- Dropdown defaults to 'Select Patient' (selected + disabled value). It must contain the 3 patient names dynamically.\n- If 'Show' is clicked without selecting, alert the user: 'Please select a patient name'.\n- Show button displays the selected patient's records in an HTML table with a Next button.\n- Next cycles through patients by ID in ascending order, looping from the last to the first.",
    constraints: [],
    starter_code: {
      typescript: "import React, { useState } from 'react';\n\n// Sample patient data representing what's in medicalRecords.js\nexport const initialPatients = [\n  { id: \"1\", name: \"John Doe\", age: 34, diagnosis: \"Flu\", treatment: \"Rest\" },\n  { id: \"2\", name: \"Jane Smith\", age: 28, diagnosis: \"Gastritis\", treatment: \"Antacids\" },\n  { id: \"3\", name: \"Alice Johnson\", age: 45, diagnosis: \"Migraine\", treatment: \"Painkillers\" }\n];\n\nexport default function App() {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it, vi } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport App from "./App";\nimport React from "react";\n\ndescribe("M4 - Patient Medical Records (sample)", () => {\n  it("shows 'Select Patient' as default option", () => {\n    render(<App />);\n    expect(screen.getByRole("option", { name: /select patient/i })).toBeDisabled();\n  });\n  it("alerts when Show clicked without selection", () => {\n    render(<App />);\n    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});\n    fireEvent.click(screen.getByRole("button", { name: /show/i }));\n    expect(alertMock).toHaveBeenCalledWith("Please select a patient name");\n    alertMock.mockRestore();\n  });\n  it("no records table visible on initial load", () => {\n    render(<App />);\n    expect(screen.queryByRole("table")).not.toBeInTheDocument();\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport App from "./App";\nimport React from "react";\n\ndescribe("M4 - Patient Medical Records (hidden)", () => {\n  it("shows records table after valid patient selection and Show click", () => {\n    render(<App />);\n    fireEvent.change(screen.getByRole("combobox"), {\n      target: { value: "1" }\n    });\n    fireEvent.click(screen.getByRole("button", { name: /show/i }));\n    expect(screen.getByRole("table")).toBeInTheDocument();\n    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();\n  });\n  it("Next button shows next patient's records", () => {\n    render(<App />);\n    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });\n    fireEvent.click(screen.getByRole("button", { name: /show/i }));\n    const firstName = screen.getByRole("table").textContent;\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    expect(screen.getByRole("table").textContent).not.toBe(firstName);\n  });\n  it("Next loops back to first patient after last", () => {\n    render(<App />);\n    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });\n    fireEvent.click(screen.getByRole("button", { name: /show/i }));\n    const firstContent = screen.getByRole("table").textContent;\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    expect(screen.getByRole("table").textContent).toBe(firstContent);\n  });\n  it("dropdown contains exactly 3 patient options plus placeholder", () => {\n    render(<App />);\n    const options = screen.getAllByRole("option");\n    expect(options).toHaveLength(4); // 1 placeholder + 3 patients\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "shows 'Select Patient' as default option", is_hidden: false },
      { test_name: "alerts when Show clicked without selection", is_hidden: false },
      { test_name: "no records table visible on initial load", is_hidden: false },
      { test_name: "shows records table after valid patient selection and Show click", is_hidden: true },
      { test_name: "Next button shows next patient's records", is_hidden: true },
      { test_name: "Next loops back to first patient after last", is_hidden: true },
      { test_name: "dropdown contains exactly 3 patient options plus placeholder", is_hidden: true }
    ]
  },
  {
    id: "M5",
    title: "Blog Post Manager",
    difficulty: "Medium",
    description: "Create a React application called 'Blog Post' allowing users to create, display, and delete blog posts. Posts appear in a grid layout, each inside a box (post-card) with a title, description, and Delete button.\n\n### Requirements\n- Two inputs: title (text) and description (textarea).\n- 'Create' button adds a post only if both fields have values.\n- After creation, both inputs are cleared.\n- Each post card displays the title, description, and a 'Delete' button to remove it.",
    constraints: [],
    starter_code: {
      typescript: "import React, { useState } from 'react';\n\nexport default function BlogPost() {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport BlogPost from "./BlogPost";\nimport React from "react";\n\ndescribe("M5 - Blog Post (sample)", () => {\n  it("renders title input, description textarea, and Create button", () => {\n    render(<BlogPost />);\n    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();\n    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();\n    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();\n  });\n  it("creates a post and displays it", () => {\n    render(<BlogPost />);\n    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: "My Post" } });\n    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: "My Desc" } });\n    fireEvent.click(screen.getByRole("button", { name: /create/i }));\n    expect(screen.getByText("My Post")).toBeInTheDocument();\n  });\n  it("does not create post if title is empty", () => {\n    render(<BlogPost />);\n    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: "Desc" } });\n    fireEvent.click(screen.getByRole("button", { name: /create/i }));\n    expect(screen.queryByText("Desc")).not.toBeInTheDocument();\n  });\n  it("Delete button removes a post", () => {\n    render(<BlogPost />);\n    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: "ToDelete" } });\n    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: "Desc" } });\n    fireEvent.click(screen.getByRole("button", { name: /create/i }));\n    fireEvent.click(screen.getByRole("button", { name: /delete/i }));\n    expect(screen.queryByText("ToDelete")).not.toBeInTheDocument();\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport BlogPost from "./BlogPost";\nimport React from "react";\n\ndescribe("M5 - Blog Post (hidden)", () => {\n  it("clears inputs after post creation", () => {\n    render(<BlogPost />);\n    const titleInput = screen.getByPlaceholderText(/title/i);\n    const descInput = screen.getByPlaceholderText(/description/i);\n\n    fireEvent.change(titleInput, { target: { value: "T" } });\n    fireEvent.change(descInput, { target: { value: "D" } });\n    fireEvent.click(screen.getByRole("button", { name: /create/i }));\n\n    expect(titleInput).toHaveValue("");\n    expect(descInput).toHaveValue("");\n  });\n  it("does not create post if description is empty", () => {\n    render(<BlogPost />);\n    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: "Title" } });\n    fireEvent.click(screen.getByRole("button", { name: /create/i }));\n    expect(screen.queryByPlaceholderText(/description/i)).toHaveValue("");\n    expect(screen.queryAllByRole("button", { name: /delete/i })).toHaveLength(0);\n  });\n  it("deleting one post does not affect others", () => {\n    render(<BlogPost />);\n    ["Post A", "Post B"].forEach(title => {\n      fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: title } });\n      fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: "Desc" } });\n      fireEvent.click(screen.getByRole("button", { name: /create/i }));\n    });\n    const deleteBtns = screen.getAllByRole("button", { name: /delete/i });\n    fireEvent.click(deleteBtns[0]);\n\n    expect(screen.queryByText("Post A")).not.toBeInTheDocument();\n    expect(screen.getByText("Post B")).toBeInTheDocument();\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "renders title input, description textarea, and Create button", is_hidden: false },
      { test_name: "creates a post and displays it", is_hidden: false },
      { test_name: "does not create post if title is empty", is_hidden: false },
      { test_name: "Delete button removes a post", is_hidden: false },
      { test_name: "clears inputs after post creation", is_hidden: true },
      { test_name: "does not create post if description is empty", is_hidden: true },
      { test_name: "deleting one post does not affect others", is_hidden: true }
    ]
  },
  {
    id: "M6",
    title: "Basic Slideshow",
    difficulty: "Medium",
    description: "Create a React 'Basic Slideshow' component that takes a `slides` prop (array of `{title, text}` objects) and supports Next, Prev, and Restart navigation. \n\n### Requirements\n- Prev and Restart buttons are disabled on the first slide.\n- Next button is disabled on the last slide.\n- Next advances the slide, Prev retreats to the previous slide, and Restart takes you back to the very first slide.",
    constraints: [],
    starter_code: {
      typescript: "import React, { useState } from 'react';\n\nexport interface Slide {\n  title: string;\n  text: string;\n}\n\nexport default function Slides({ slides }: { slides: Slide[] }) {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport Slides from "./Slides";\nimport React from "react";\n\nconst slides = [\n  { title: "Slide 1", text: "Content 1" },\n  { title: "Slide 2", text: "Content 2" },\n  { title: "Slide 3", text: "Content 3" },\n];\n\ndescribe("M6 - Slideshow (sample)", () => {\n  it("renders first slide on load", () => {\n    render(<Slides slides={slides} />);\n    expect(screen.getByText("Slide 1")).toBeInTheDocument();\n  });\n  it("Prev and Restart are disabled on first slide", () => {\n    render(<Slides slides={slides} />);\n    expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();\n    expect(screen.getByRole("button", { name: /restart/i })).toBeDisabled();\n  });\n  it("Next advances to second slide", () => {\n    render(<Slides slides={slides} />);\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    expect(screen.getByText("Slide 2")).toBeInTheDocument();\n  });\n  it("Next is disabled on last slide", () => {\n    render(<Slides slides={slides} />);\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport Slides from "./Slides";\nimport React from "react";\n\nconst slides = [\n  { title: "S1", text: "T1" },\n  { title: "S2", text: "T2" },\n  { title: "S3", text: "T3" },\n];\n\ndescribe("M6 - Slideshow (hidden)", () => {\n  it("Restart returns to first slide from any position", () => {\n    render(<Slides slides={slides} />);\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    fireEvent.click(screen.getByRole("button", { name: /restart/i }));\n    expect(screen.getByText("S1")).toBeInTheDocument();\n  });\n  it("Prev goes back to previous slide", () => {\n    render(<Slides slides={slides} />);\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    fireEvent.click(screen.getByRole("button", { name: /prev/i }));\n    expect(screen.getByText("S1")).toBeInTheDocument();\n  });\n  it("Prev and Restart enabled after advancing from first slide", () => {\n    render(<Slides slides={slides} />);\n    fireEvent.click(screen.getByRole("button", { name: /next/i }));\n    expect(screen.getByRole("button", { name: /prev/i })).not.toBeDisabled();\n    expect(screen.getByRole("button", { name: /restart/i })).not.toBeDisabled();\n  });\n  it("single-slide deck disables Next, Prev, and Restart", () => {\n    render(<Slides slides={[{ title: "Only", text: "One" }]} />);\n    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();\n    expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();\n    expect(screen.getByRole("button", { name: /restart/i })).toBeDisabled();\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "renders first slide on load", is_hidden: false },
      { test_name: "Prev and Restart are disabled on first slide", is_hidden: false },
      { test_name: "Next advances to second slide", is_hidden: false },
      { test_name: "Next is disabled on last slide", is_hidden: false },
      { test_name: "Restart returns to first slide from any position", is_hidden: true },
      { test_name: "Prev goes back to previous slide", is_hidden: true },
      { test_name: "Prev and Restart enabled after advancing from first slide", is_hidden: true },
      { test_name: "single-slide deck disables Next, Prev, and Restart", is_hidden: true }
    ]
  },
  {
    id: "M7",
    title: "Employee Validation Form",
    difficulty: "Medium",
    description: "Create a React app with an `EmployeeValidationForm` component collecting Name, Email, Employee ID, and Joining Date — each with inline validation. Submit is disabled until all fields are valid.\n\n### Validation Rules\n1. **Name**: At least 4 characters, only letters and spaces.\n2. **Email**: Valid email format.\n3. **Employee ID**: Exactly 6 numeric digits.\n4. **Joining Date**: Must not be a future date.",
    constraints: [],
    starter_code: {
      typescript: "import React, { useState } from 'react';\n\nexport default function EmployeeValidationForm() {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport EmployeeValidationForm from "./EmployeeValidationForm";\nimport React from "react";\n\ndescribe("M7 - Employee Validation Form (sample)", () => {\n  it("submit button is disabled initially", () => {\n    render(<EmployeeValidationForm />);\n    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();\n  });\n  it("shows name error for short name", () => {\n    render(<EmployeeValidationForm />);\n    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "AB" } });\n    expect(screen.getByText(/at least 4 characters/i)).toBeInTheDocument();\n  });\n  it("shows email error for invalid format", () => {\n    render(<EmployeeValidationForm />);\n    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "notanemail" } });\n    expect(screen.getByText(/valid email/i)).toBeInTheDocument();\n  });\n  it("shows employee ID error for non-6-digit input", () => {\n    render(<EmployeeValidationForm />);\n    fireEvent.change(screen.getByLabelText(/employee id/i), { target: { value: "123" } });\n    expect(screen.getByText(/exactly 6 digits/i)).toBeInTheDocument();\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport EmployeeValidationForm from "./EmployeeValidationForm";\nimport React from "react";\n\ndescribe("M7 - Employee Validation Form (hidden)", () => {\n  it("submit enabled when all fields valid", () => {\n    render(<EmployeeValidationForm />);\n    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });\n    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "j@j.com" } });\n    fireEvent.change(screen.getByLabelText(/employee id/i), { target: { value: "123456" } });\n    fireEvent.change(screen.getByLabelText(/joining date/i), { target: { value: "2020-01-01" } });\n    expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();\n  });\n  it("resets form after submission", () => {\n    render(<EmployeeValidationForm />);\n    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });\n    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "j@j.com" } });\n    fireEvent.change(screen.getByLabelText(/employee id/i), { target: { value: "123456" } });\n    fireEvent.change(screen.getByLabelText(/joining date/i), { target: { value: "2020-01-01" } });\n    fireEvent.click(screen.getByRole("button", { name: /submit/i }));\n    expect(screen.getByLabelText(/name/i)).toHaveValue("");\n  });\n  it("rejects name with numbers", () => {\n    render(<EmployeeValidationForm />);\n    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John1" } });\n    expect(screen.getByText(/only contain letters and spaces/i)).toBeInTheDocument();\n  });\n  it("rejects future joining date", () => {\n    render(<EmployeeValidationForm />);\n    fireEvent.change(screen.getByLabelText(/joining date/i), { target: { value: "2099-01-01" } });\n    expect(screen.getByText(/cannot be in the future/i)).toBeInTheDocument();\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "submit button is disabled initially", is_hidden: false },
      { test_name: "shows name error for short name", is_hidden: false },
      { test_name: "shows email error for invalid format", is_hidden: false },
      { test_name: "shows employee ID error for non-6-digit input", is_hidden: false },
      { test_name: "submit enabled when all fields valid", is_hidden: true },
      { test_name: "resets form after submission", is_hidden: true },
      { test_name: "rejects name with numbers", is_hidden: true },
      { test_name: "rejects future joining date", is_hidden: true }
    ]
  },
  {
    id: "M8",
    title: "CryptoRank Exchange",
    difficulty: "Medium",
    description: "Build a 'CryptoRank Exchange' React app that estimates cryptocurrency coins received for a given fiat amount. Show a table of Exchange Rate and Number of Coins. Validate amount against available balance.\n\n### Conversion Formula\n`Number of Coins = Amount * Exchange Rate` (round/format to 8 decimal places)\n\n### Form Inputs\n- An input (type: `spinbutton` or `number`) for selecting/specifying currency amount.\n\n### Error messages\n- Empty input: 'Amount cannot be empty'\n- Amount < 0.01: 'Amount cannot be less than 0.01'\n- Amount > balance: 'Amount cannot exceed the available balance'\nAll coins show 'n/a' when inputs are invalid.",
    constraints: [],
    starter_code: {
      typescript: "import React, { useState } from 'react';\n\nexport default function CryptoRankExchange({ balance = 500 }: { balance?: number }) {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport CryptoRankExchange from "./CryptoRankExchange";\nimport React from "react";\n\ndescribe("M8 - CryptoRank Exchange (sample)", () => {\n  it("shows 0.00000000 by default for all coins", () => {\n    render(<CryptoRankExchange />);\n    const zeros = screen.getAllByText("0.00000000");\n    expect(zeros.length).toBeGreaterThanOrEqual(1);\n  });\n  it("shows error for empty input", () => {\n    render(<CryptoRankExchange />);\n    const input = screen.getByRole("spinbutton");\n    fireEvent.change(input, { target: { value: "" } });\n    expect(screen.getByText("Amount cannot be empty")).toBeInTheDocument();\n  });\n  it("shows error when amount below 0.01", () => {\n    render(<CryptoRankExchange />);\n    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "0.001" } });\n    expect(screen.getByText("Amount cannot be less than 0.01")).toBeInTheDocument();\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport CryptoRankExchange from "./CryptoRankExchange";\nimport React from "react";\n\ndescribe("M8 - CryptoRank Exchange (hidden)", () => {\n  it("shows n/a for all coins on invalid amount", () => {\n    render(<CryptoRankExchange />);\n    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "999999" } });\n    const nas = screen.getAllByText("n/a");\n    expect(nas.length).toBeGreaterThanOrEqual(1);\n  });\n  it("calculates coins to 8 decimal places for valid amount", () => {\n    render(<CryptoRankExchange />);\n    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "100" } });\n    const coinValues = screen.queryAllByText(/^\\d+\\.\\d{8}$/);\n    expect(coinValues.length).toBeGreaterThanOrEqual(1);\n  });\n  it("table updates dynamically as amount changes", () => {\n    render(<CryptoRankExchange />);\n    const input = screen.getByRole("spinbutton");\n    fireEvent.change(input, { target: { value: "50" } });\n    const val50 = screen.queryAllByText(/^\\d+\\.\\d{8}$/);\n    fireEvent.change(input, { target: { value: "100" } });\n    const val100 = screen.queryAllByText(/^\\d+\\.\\d{8}$/);\n    expect(val50[0]?.textContent).not.toBe(val100[0]?.textContent);\n  });\n  it("error message for exceeding balance", () => {\n    render(<CryptoRankExchange balance={500} />);\n    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "501" } });\n    expect(screen.getByText("Amount cannot exceed the available balance")).toBeInTheDocument();\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "shows 0.00000000 by default for all coins", is_hidden: false },
      { test_name: "shows error for empty input", is_hidden: false },
      { test_name: "shows error when amount below 0.01", is_hidden: false },
      { test_name: "shows n/a for all coins on invalid amount", is_hidden: true },
      { test_name: "calculates coins to 8 decimal places for valid amount", is_hidden: true },
      { test_name: "table updates dynamically as amount changes", is_hidden: true },
      { test_name: "error message for exceeding balance", is_hidden: true }
    ]
  },
  {
    id: "M9",
    title: "useQuery Custom Hook",
    difficulty: "Medium",
    description: "Implement a custom React Hook `useQuery<T>` that manages query executions, load states, error capture, and data storage for custom promises.\n\n### Signature\n```ts\nfunction useQuery<T>(\n  fn: () => Promise<T>,\n  deps: DependencyList = []\n): QueryResult<T>\n```\n\n### Returns one of:\n- `{ status: \"loading\" }`\n- `{ status: \"error\"; error: Error }`\n- `{ status: \"success\"; data: T }`",
    constraints: [],
    starter_code: {
      typescript: "import { DependencyList, useState, useEffect } from 'react';\n\nexport type QueryResult<T> =\n  | { status: 'loading' }\n  | { status: 'error'; error: Error }\n  | { status: 'success'; data: T };\n\nexport function useQuery<T>(fn: () => Promise<T>, deps: DependencyList = []): QueryResult<T> {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it, vi } from "vitest";\nimport { renderHook, waitFor } from "@testing-library/react";\nimport { useQuery } from "./useQuery";\n\ndescribe("M9 - useQuery (sample)", () => {\n  it("returns loading status initially", () => {\n    const { result } = renderHook(() =>\n      useQuery(() => new Promise(() => {}))\n    );\n    expect(result.current.status).toBe("loading");\n  });\n  it("returns success status with data on resolution", async () => {\n    const { result } = renderHook(() =>\n      useQuery(() => Promise.resolve(42))\n    );\n    await waitFor(() => expect(result.current.status).toBe("success"));\n    if (result.current.status === "success") {\n      expect(result.current.data).toBe(42);\n    }\n  });\n  it("returns error status on rejection", async () => {\n    const { result } = renderHook(() =>\n      useQuery(() => Promise.reject(new Error("Oops")))\n    );\n    await waitFor(() => expect(result.current.status).toBe("error"));\n    if (result.current.status === "error") {\n      expect(result.current.error.message).toBe("Oops");\n    }\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it, vi } from "vitest";\nimport { renderHook, waitFor, act } from "@testing-library/react";\nimport { useQuery } from "./useQuery";\n\ndescribe("M9 - useQuery (hidden)", () => {\n  it("re-runs fn when deps change", async () => {\n    let count = 0;\n    const fn = vi.fn(() => Promise.resolve(++count));\n    const { result, rerender } = renderHook(\n      ({ id }) => useQuery(() => fn(), [id]),\n      { initialProps: { id: 1 } }\n    );\n    await waitFor(() => expect(result.current.status).toBe("success"));\n    rerender({ id: 2 });\n    await waitFor(() => {\n      if (result.current.status === "success") expect(result.current.data).toBe(2);\n    });\n    expect(fn).toHaveBeenCalledTimes(2);\n  });\n  it("does not update state for stale async responses", async () => {\n    let resolve1!: (v: number) => void;\n    let resolve2!: (v: number) => void;\n    const { result, rerender } = renderHook(\n      ({ id }) => useQuery(\n        () => id === 1 ? new Promise(r => { resolve1 = r; }) : new Promise(r => { resolve2 = r; }),\n        [id]\n      ),\n      { initialProps: { id: 1 } }\n    );\n    rerender({ id: 2 });\n    act(() => { resolve2(200); });\n    await waitFor(() => expect(result.current.status).toBe("success"));\n    act(() => { resolve1(100); }); // stale response\n    await new Promise(r => setTimeout(r, 50));\n    if (result.current.status === "success") expect(result.current.data).toBe(200);\n  });\n  it("defaults deps to [] and runs only once without deps", async () => {\n    const fn = vi.fn(() => Promise.resolve("ok"));\n    const { rerender } = renderHook(() => useQuery(fn));\n    rerender();\n    await new Promise(r => setTimeout(r, 50));\n    expect(fn).toHaveBeenCalledTimes(1);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "returns loading status initially", is_hidden: false },
      { test_name: "returns success status with data on resolution", is_hidden: false },
      { test_name: "returns error status on rejection", is_hidden: false },
      { test_name: "re-runs fn when deps change", is_hidden: true },
      { test_name: "does not update state for stale async responses", is_hidden: true },
      { test_name: "defaults deps to [] and runs only once without deps", is_hidden: true }
    ]
  },
  {
    id: "M10",
    title: "useArray Custom Hook",
    difficulty: "Medium",
    description: "Implement a custom React Hook `useArray` that manages dynamic array state modifications with utility helpers.\n\n### Provided Methods\n1. `push(item)`: Appends an item to the end of the array.\n2. `update(index, item)`: Replaces element at specified index.\n3. `remove(index)`: Removes item at specific index (out-of-bounds must not throw errors).\n4. `filter(callback)`: Filters the elements containing a condition.\n5. `set(newArray)`: Replaces the entire array.\n6. `clear()`: Empties the array.\nAll updates must immediately refresh references.",
    constraints: [],
    starter_code: {
      typescript: "import { useState } from 'react';\n\nexport function useArray<T>(initialValue: T[] = []) {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { renderHook, act } from "@testing-library/react";\nimport { useArray } from "./useArray";\n\ndescribe("M10 - useArray (sample)", () => {\n  it("initializes with default value", () => {\n    const { result } = renderHook(() => useArray(["apple", "banana"]));\n    expect(result.current.array).toEqual(["apple", "banana"]);\n  });\n  it("push adds item to end", () => {\n    const { result } = renderHook(() => useArray<string>([]));\n    act(() => result.current.push("orange"));\n    expect(result.current.array).toEqual(["orange"]);\n  });\n  it("remove removes item at index", () => {\n    const { result } = renderHook(() => useArray(["a","b","c"]));\n    act(() => result.current.remove(1));\n    expect(result.current.array).toEqual(["a","c"]);\n  });\n  it("clear empties the array", () => {\n    const { result } = renderHook(() => useArray([1,2,3]));\n    act(() => result.current.clear());\n    expect(result.current.array).toEqual([]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { renderHook, act } from "@testing-library/react";\nimport { useArray } from "./useArray";\n\ndescribe("M10 - useArray (hidden)", () => {\n  it("update replaces element at index", () => {\n    const { result } = renderHook(() => useArray(["apple","banana"]));\n    act(() => result.current.update(1, "grape"));\n    expect(result.current.array).toEqual(["apple","grape"]);\n  });\n  it("filter retains only matching elements", () => {\n    const { result } = renderHook(() => useArray(["apple","banana","avocado"]));\n    act(() => result.current.filter(f => f.includes("a")));\n    expect(result.current.array).toEqual(["apple","banana","avocado"]);\n  });\n  it("set replaces entire array", () => {\n    const { result } = renderHook(() => useArray([1,2,3]));\n    act(() => result.current.set([10,20]));\n    expect(result.current.array).toEqual([10,20]);\n  });\n  it("push to empty array creates single-element array", () => {\n    const { result } = renderHook(() => useArray<number>([]));\n    act(() => result.current.push(99));\n    expect(result.current.array).toHaveLength(1);\n    expect(result.current.array[0]).toBe(99);\n  });\n  it("remove at out-of-bounds index does not throw", () => {\n    const { result } = renderHook(() => useArray([1,2]));\n    expect(() => act(() => result.current.remove(10))).not.toThrow();\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "initializes with default value", is_hidden: false },
      { test_name: "push adds item to end", is_hidden: false },
      { test_name: "remove removes item at index", is_hidden: false },
      { test_name: "clear empties the array", is_hidden: false },
      { test_name: "update replaces element at index", is_hidden: true },
      { test_name: "filter retains only matching elements", is_hidden: true },
      { test_name: "set replaces entire array", is_hidden: true },
      { test_name: "push to empty array creates single-element array", is_hidden: true },
      { test_name: "remove at out-of-bounds index does not throw", is_hidden: true }
    ]
  }
];

module.exports = mediumProblems;
