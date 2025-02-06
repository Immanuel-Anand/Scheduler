import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export const checkUser = async () => {
  const user = await currentUser();
  // const { userId } = auth();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db?.user.findUnique({
      where: {
        clerkUserId: user?.id,
      },
    });
    if (loggedInUser) {
      return loggedInUser;
    }
    // If user is not loggedIn, then we need to create a new user inside our db
    console.log(user);
    const name = `${user.firstName} ${user.lastName}`;

    // await clerkClient().users.updateUser(user.id, {
    //   username: name.split(" ").join("-") + user.id.slice(-4),
    // });

    const username = uuidv4();
    console.log("username is,", username);

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: name.split(" ").join("-") + user.id.slice(-4),
      },
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
};
