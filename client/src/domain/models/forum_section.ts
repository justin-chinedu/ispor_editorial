export interface ForumSection {
    id: number,
    parent?: number,
    title: string,
    desc: string,
    image: string,
}

export const mockSections: ForumSection[] = [
    {
        id: 1,
        title: "General",
        desc: "Veniam anim nostrud irure deserunt mollit irure consequat veniam culpa.",
        image: ""
    }, {
        id: 2,
        title: "Education",
        desc: "Dolor aliqua eu culpa ipsum nulla et minim quis aliquip laboris in cupidatat esse cupidatat.",
        image: ""
    },
    {
        id: 3,
        title: "Sex Education",
        desc: "Duis ut esse adipisicing elit tempor laborum culpa.",
        image: "",
        parent: 2
    },
    {
        id: 4,
        title: "Diet Education",
        desc: "Duis ut esse adipisicing elit tempor laborum culpa.",
        image: "",
        parent: 2
    }

]