import { ForumSection } from "../models/forum_section";
import client from "../services/supabase";

export interface ForumSectionsDaoI {
    fetchAllSections(): Promise<ForumSection[]>
}

class ForumSectionsDao implements ForumSectionsDaoI {
    async fetchAllSections(): Promise<ForumSection[]> {
        let builder = client.from('forum_sections')
            .select<"*", ForumSection>("*");
        const resp = await builder;
        if (resp.error) {
            throw resp.error;
        } else {
            return resp.data;
        }
    }
}

const forumSectionDao: ForumSectionsDaoI = new ForumSectionsDao();
export default forumSectionDao;