export type CommentCreateDTO = {
    postId: string;
    userId: string;
    body: string;
};

export type CommentUpdateDTO = {
    body: string;
};
