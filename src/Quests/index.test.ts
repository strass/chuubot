import Quest from "."

describe('Quest', ()=> {
    it('should produce ttl', () => {
        const quest = new Quest();
        expect(quest.ttl).toMatchInlineSnapshot()
    })
})