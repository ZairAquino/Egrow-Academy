import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get('auth-token')?.value
    const headerToken = extractTokenFromHeader(request)
    const token = cookieToken || headerToken

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 })
    }

    const { userId } = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        profileImage: true,
        membershipLevel: true,
        userPreferences: {
          select: {
            interests: true,
            skillLevel: true,
            learningGoals: true,
            preferredTopics: true,
            badgeCustomization: true,
            notificationPreferences: true,
            privacySettings: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Parse JSON fields if they exist
    if (user.userPreferences) {
      if (user.userPreferences.notificationPreferences) {
        try {
          user.userPreferences.notificationPreferences = JSON.parse(user.userPreferences.notificationPreferences)
        } catch (e) {
          console.error('Error parsing notification preferences:', e)
        }
      }
      if (user.userPreferences.privacySettings) {
        try {
          user.userPreferences.privacySettings = JSON.parse(user.userPreferences.privacySettings)
        } catch (e) {
          console.error('Error parsing privacy settings:', e)
        }
      }
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 [PROFILE API] PUT request received');
    
    const cookieToken = request.cookies.get('auth-token')?.value
    const headerToken = extractTokenFromHeader(request)
    const token = cookieToken || headerToken

    if (!token) {
      console.log('❌ [PROFILE API] No token provided');
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 })
    }

    const { userId } = verifyToken(token)
    console.log('✅ [PROFILE API] Token verified for user:', userId);
    
    const body = await request.json()
    console.log('📄 [PROFILE API] Request body keys:', Object.keys(body));

    const {
      firstName,
      lastName,
      username,
      profileImage,
      badgeCustomization,
      notifications,
      privacy
    } = body

    console.log('🎯 [PROFILE API] Badge customization provided:', !!badgeCustomization);

    // Update user basic info - only include fields that are provided
    console.log('👤 [PROFILE API] Updating user basic info...');
    const updateData: any = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (username !== undefined) updateData.username = username;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    
    console.log('📝 [PROFILE API] Fields to update:', Object.keys(updateData));
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })
    console.log('✅ [PROFILE API] User basic info updated');

    // Update or create user preferences with badge customization, notifications, and privacy
    if (badgeCustomization || notifications || privacy) {
      console.log('🏆 [PROFILE API] Updating user preferences...');
      try {
        // First, try to find existing preferences
        const existingPrefs = await prisma.userPreference.findUnique({
          where: { userId }
        });

        const updateData: any = {};
        
        if (badgeCustomization !== undefined) {
          updateData.badgeCustomization = JSON.stringify(badgeCustomization);
          console.log('📝 [PROFILE API] Updating badge customization');
        }
        
        if (notifications !== undefined) {
          updateData.notificationPreferences = JSON.stringify(notifications);
          console.log('🔔 [PROFILE API] Updating notification preferences');
        }
        
        if (privacy !== undefined) {
          updateData.privacySettings = JSON.stringify(privacy);
          console.log('🔒 [PROFILE API] Updating privacy settings');
        }

        if (existingPrefs) {
          console.log('📝 [PROFILE API] Updating existing preferences...');
          await prisma.userPreference.update({
            where: { userId },
            data: updateData
          });
        } else {
          console.log('🆕 [PROFILE API] Creating new preferences...');
          await prisma.userPreference.create({
            data: {
              userId,
              ...updateData,
              interests: [],
              learningGoals: [],
              preferredTopics: []
            }
          });
        }
        console.log('✅ [PROFILE API] User preferences saved successfully');
      } catch (prefError) {
        console.error('❌ [PROFILE API] Error updating preferences:', prefError);
        // Continue without failing - preferences are optional
      }
    }

    console.log('🎉 [PROFILE API] Profile update completed successfully');
    return NextResponse.json({ 
      message: 'Perfil actualizado exitosamente',
      user: updatedUser 
    })
  } catch (error) {
    console.error('❌ [PROFILE API] Error al actualizar perfil:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 })
  }
}