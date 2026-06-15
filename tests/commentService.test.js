const Comment = require("../models/Comment");
const Note = require("../models/Note");

const {
    createComment,
    getCommentsByNote,
} = require("../services/commentService");


// Mock models
jest.mock("../models/Comment");
jest.mock("../models/Note");


// Clear old mock history before every test
beforeEach(() => {
    jest.clearAllMocks();
});


describe("commentService - createComment", () => {
    test("should create comment successfully", async () => {
        // =====================
        // ARRANGE
        // =====================

        const fakeNote = {
            _id: "note123",
            title: "Test Note",
        };

        const fakeComment = {
            _id: "comment123",
            text: "This is a test comment",
            note: "note123",
            user: "user123",
        };

        // Note exists
        Note.findById.mockResolvedValue(fakeNote);

        // Comment is created
        Comment.create.mockResolvedValue(fakeComment);


        // =====================
        // ACT
        // =====================

        const result = await createComment(
            "This is a test comment",
            "note123",
            "user123"
        );


        // =====================
        // ASSERT
        // =====================

        expect(Note.findById).toHaveBeenCalledWith(
            "note123"
        );

        expect(Comment.create).toHaveBeenCalledWith({
            text: "This is a test comment",
            note: "note123",
            user: "user123",
        });

        expect(result).toEqual(fakeComment);
    });


    test("should throw error when note does not exist", async () => {
        // =====================
        // ARRANGE
        // =====================

        // Note not found
        Note.findById.mockResolvedValue(null);


        // =====================
        // ACT + ASSERT
        // =====================

        await expect(
            createComment(
                "This is a test comment",
                "wrongNoteId",
                "user123"
            )
        ).rejects.toMatchObject({
            message:"Note not found",
            statusCode:404,
        });


        // Verify note lookup happened
        expect(Note.findById).toHaveBeenCalledWith(
            "wrongNoteId"
        );

        // Very important:
        // If note does not exist, comment should not be created
        expect(Comment.create).not.toHaveBeenCalled();
    });
});


describe("commentService - getCommentsByNote", () => {
    test("should get comments by note successfully", async () => {
        // =====================
        // ARRANGE
        // =====================

        const fakeComments = [
            {
                _id: "comment1",
                text: "First comment",
                note: {
                    _id: "note123",
                    title: "Test Note",
                    content: "Note content",
                },
                user: {
                    _id: "user123",
                    name: "Prem",
                    email: "prem@gmail.com",
                },
            },
            {
                _id: "comment2",
                text: "Second comment",
                note: {
                    _id: "note123",
                    title: "Test Note",
                    content: "Note content",
                },
                user: {
                    _id: "user456",
                    name: "Rahul",
                    email: "rahul@gmail.com",
                },
            },
        ];

        // Fake Mongoose query chain:
        // Comment.find().populate().populate().sort()
        const mockQuery = {
            populate: jest.fn().mockReturnThis(),

            sort: jest.fn().mockResolvedValue(
                fakeComments
            ),
        };

        Comment.find.mockReturnValue(mockQuery);


        // =====================
        // ACT
        // =====================

        const result = await getCommentsByNote(
            "note123"
        );


        // =====================
        // ASSERT
        // =====================

        expect(Comment.find).toHaveBeenCalledWith({
            note: "note123",
        });

        expect(mockQuery.populate).toHaveBeenCalledWith(
            "user",
            "name email"
        );

        expect(mockQuery.populate).toHaveBeenCalledWith(
            "note",
            "title content"
        );

        expect(mockQuery.sort).toHaveBeenCalledWith({
            createdAt: -1,
        });

        expect(result).toEqual(fakeComments);
    });
});